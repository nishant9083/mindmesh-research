import { useState, useEffect, useCallback } from "react"
import { getCoinOHLC, type OHLCData } from "@/services/coingecko-api"
import { TIMEFRAME_TO_INTERVAL, type ChartTimeframe } from "@/types"

interface UseCoinOHLCOptions {
  vs_currency?: string
  autoRefresh?: boolean
  refreshInterval?: number // in milliseconds
}

interface UseCoinOHLCReturn {
  data: OHLCData[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch and manage OHLC (candlestick) data for a coin
 * @param coinId - The coin ID (e.g., "bitcoin")
 * @param timeframe - Chart timeframe
 * @param options - Configuration options
 * @returns OHLC data, loading state, error, and refetch function
 */
export function useCoinOHLC(
  coinId: string,
  timeframe: ChartTimeframe = "7D",
  options: UseCoinOHLCOptions = {}
): UseCoinOHLCReturn {
  const {
    vs_currency = "usd",
    autoRefresh = false,
    refreshInterval = 60000, // 1 minute default
  } = options

  const [data, setData] = useState<OHLCData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOHLC = useCallback(async () => {
    if (!coinId) {
      setError("Coin ID is required")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const days = TIMEFRAME_TO_INTERVAL[timeframe]
      const ohlcData = await getCoinOHLC(coinId, vs_currency, days)

      setData(ohlcData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch OHLC data"
      setError(errorMessage)
      console.error(`Error in useCoinOHLC for ${coinId}:`, err)
    } finally {
      setIsLoading(false)
    }
  }, [coinId, timeframe, vs_currency])

  // Fetch when dependencies change
  useEffect(() => {
    fetchOHLC()
  }, [fetchOHLC])

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh || isLoading) return

    const intervalId = setInterval(() => {
      fetchOHLC()
    }, refreshInterval)

    return () => clearInterval(intervalId)
  }, [autoRefresh, refreshInterval, isLoading, fetchOHLC])

  return {
    data,
    isLoading,
    error,
    refetch: fetchOHLC,
  }
}
