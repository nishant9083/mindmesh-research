import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import { getCoinMarkets, getMultipleCoinCharts, type CoinMarketData, type CoinHistoricalData } from "@/services/coingecko-api"

// Time range type and mapping
export type TimeRange = "1D" | "7D" | "30D" | "90D" | "1Y" | "Max"

export interface CoinGeckoContextValue {
  // Market Data
  marketData: CoinMarketData[]
  isLoadingMarkets: boolean
  marketError: string | null
  
  // Chart Data
  chartData: Record<string, CoinHistoricalData>
  isLoadingCharts: boolean
  chartError: string | null
  
  // Selected Assets
  selectedAssets: string[]
  setSelectedAssets: (assets: string[]) => void
  toggleAsset: (coinId: string) => void
  clearAssets: () => void
  
  // Time Range
  timeRange: TimeRange
  setTimeRange: (range: TimeRange) => void
  
  // Actions
  refreshMarketData: () => Promise<void>
  fetchChartDataForAssets: (coinIds: string[], days?: string | number) => Promise<void>
  
  // Utilities
  getCoinById: (coinId: string) => CoinMarketData | undefined
  searchCoins: (query: string) => CoinMarketData[]
}

const CoinGeckoContext = createContext<CoinGeckoContextValue | undefined>(undefined)

// Time range to days mapping
const timeRangeToDays: Record<TimeRange, string | number> = {
  "1D": 1,
  "7D": 7,
  "30D": 30,
  "90D": 90,
  "1Y": 365,
  "Max": "max",
}

// Time range to price change percentage parameter mapping
const timeRangeToPriceChangeParam: Record<TimeRange, string> = {
  "1D": "24h",
  "7D": "7d",
  "30D": "30d",
  "90D": "200d", // CoinGecko doesn't have 90d, use 200d as closest
  "1Y": "1y",
  "Max": "1y", // Use 1y for max as well
}

interface CoinGeckoProviderProps {
  children: ReactNode
  autoRefreshInterval?: number // in milliseconds, default 60000 (1 minute)
  initialTimeRange?: TimeRange
  initialSelectedAssets?: string[] // Initial assets to select
}

export function CoinGeckoProvider({ 
  children, 
  autoRefreshInterval = 60000,
  initialTimeRange = "7D",
  initialSelectedAssets = []
}: CoinGeckoProviderProps) {
  // Market Data State
  const [marketData, setMarketData] = useState<CoinMarketData[]>([])
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(true)
  const [marketError, setMarketError] = useState<string | null>(null)
  
  // Chart Data State
  const [chartData, setChartData] = useState<Record<string, CoinHistoricalData>>({})
  const [isLoadingCharts, setIsLoadingCharts] = useState(false)
  const [chartError, setChartError] = useState<string | null>(null)
  
  // Selection State
  const [selectedAssets, setSelectedAssets] = useState<string[]>(initialSelectedAssets)
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange)

  // Fetch market data
  const fetchMarketData = useCallback(async () => {
    try {
      setIsLoadingMarkets(true)
      setMarketError(null)
      const priceChangeParam = timeRangeToPriceChangeParam[timeRange]
      
      // Fetch multiple pages to get more coins (up to 500 coins - 2 pages of 250)
      const [page1, page2] = await Promise.all([
        getCoinMarkets({
          per_page: 250,
          page: 1,
          price_change_percentage: priceChangeParam,
        }),
        getCoinMarkets({
          per_page: 250,
          page: 2,
          price_change_percentage: priceChangeParam,
        })
      ])
      
      const allData = [...page1, ...page2]
      setMarketData(allData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch market data"
      setMarketError(errorMessage)
      console.error("Error fetching market data:", err)
    } finally {
      setIsLoadingMarkets(false)
    }
  }, [timeRange])

  // Fetch chart data for specific assets
  const fetchChartDataForAssets = useCallback(async (
    coinIds: string[], 
    days?: string | number
  ) => {
    if (coinIds.length === 0) {
      setChartData({})
      return
    }

    try {
      setIsLoadingCharts(true)
      setChartError(null)
      const daysToFetch = days ?? timeRangeToDays[timeRange]
      const data = await getMultipleCoinCharts(coinIds, "usd", daysToFetch)
      setChartData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch chart data"
      setChartError(errorMessage)
      console.error("Error fetching chart data:", err)
    } finally {
      setIsLoadingCharts(false)
    }
  }, [timeRange])

  // Toggle asset selection
  const toggleAsset = useCallback((coinId: string) => {
    setSelectedAssets(prev => {
      if (prev.includes(coinId)) {
        return prev.filter(id => id !== coinId)
      }
      return [...prev, coinId]
    })
  }, [])

  // Clear all selected assets
  const clearAssets = useCallback(() => {
    setSelectedAssets([])
  }, [])

  // Get coin by ID
  const getCoinById = useCallback((coinId: string) => {
    return marketData.find(coin => coin.id === coinId)
  }, [marketData])

  // Search coins
  const searchCoins = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase()
    return marketData.filter(coin => 
      coin.symbol.toLowerCase().includes(lowerQuery) ||
      coin.name.toLowerCase().includes(lowerQuery) ||
      coin.id.toLowerCase().includes(lowerQuery)
    )
  }, [marketData])

  // Initial fetch
  useEffect(() => {
    fetchMarketData()
  }, [fetchMarketData])

  // Auto-refresh market data
  useEffect(() => {
    if (!autoRefreshInterval) return

    const interval = setInterval(() => {
      fetchMarketData()
    }, autoRefreshInterval)

    return () => clearInterval(interval)
  }, [autoRefreshInterval, fetchMarketData])

  // Fetch chart data when selected assets or time range changes
  useEffect(() => {
    if (selectedAssets.length > 0) {
      fetchChartDataForAssets(selectedAssets)
    } else {
      setChartData({})
    }
  }, [selectedAssets, timeRange, fetchChartDataForAssets])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<CoinGeckoContextValue>(() => ({
    // Market Data
    marketData,
    isLoadingMarkets,
    marketError,
    
    // Chart Data
    chartData,
    isLoadingCharts,
    chartError,
    
    // Selected Assets
    selectedAssets,
    setSelectedAssets,
    toggleAsset,
    clearAssets,
    
    // Time Range
    timeRange,
    setTimeRange,
    
    // Actions
    refreshMarketData: fetchMarketData,
    fetchChartDataForAssets,
    
    // Utilities
    getCoinById,
    searchCoins,
  }), [
    marketData,
    isLoadingMarkets,
    marketError,
    chartData,
    isLoadingCharts,
    chartError,
    selectedAssets,
    timeRange,
    toggleAsset,
    clearAssets,
    fetchMarketData,
    fetchChartDataForAssets,
    getCoinById,
    searchCoins,
  ])

  return (
    <CoinGeckoContext.Provider value={contextValue}>
      {children}
    </CoinGeckoContext.Provider>
  )
}

// Custom hook to use CoinGecko context
export function useCoinGecko() {
  const context = useContext(CoinGeckoContext)
  if (context === undefined) {
    throw new Error("useCoinGecko must be used within a CoinGeckoProvider")
  }
  return context
}

// Custom hook for market data only
export function useMarketData() {
  const { marketData, isLoadingMarkets, marketError, refreshMarketData } = useCoinGecko()
  return { marketData, isLoadingMarkets, marketError, refreshMarketData }
}

// Custom hook for chart data only
export function useChartData() {
  const { chartData, isLoadingCharts, chartError, fetchChartDataForAssets } = useCoinGecko()
  return { chartData, isLoadingCharts, chartError, fetchChartDataForAssets }
}

// Custom hook for asset selection
export function useAssetSelection() {
  const { selectedAssets, setSelectedAssets, toggleAsset, clearAssets } = useCoinGecko()
  return { selectedAssets, setSelectedAssets, toggleAsset, clearAssets }
}

// Custom hook for specific coin
export function useCoin(coinId: string) {
  const { getCoinById } = useCoinGecko()
  return useMemo(() => getCoinById(coinId), [coinId, getCoinById])
}

// Custom hook for searching coins
export function useCoinSearch(query: string) {
  const { searchCoins } = useCoinGecko()
  return useMemo(() => searchCoins(query), [query, searchCoins])
}
