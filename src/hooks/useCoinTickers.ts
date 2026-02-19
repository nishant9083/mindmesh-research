import { useState, useEffect, useCallback } from "react"
import { getCoinTickers, type CoinTickerResponse } from "@/services/coingecko-api"

interface UseCoinTickersOptions {
  page?: number
  autoRefresh?: boolean
  refreshInterval?: number // in milliseconds
}

interface UseCoinTickersReturn {
  data: CoinTickerResponse | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  nextPage: () => void
  prevPage: () => void
  currentPage: number
}

/**
 * Hook to fetch and manage coin trading pairs/tickers
 * @param coinId - The coin ID (e.g., "bitcoin")
 * @param options - Configuration options
 * @returns Ticker data, loading state, error, and pagination functions
 */
export function useCoinTickers(
  coinId: string,
  options: UseCoinTickersOptions = {}
): UseCoinTickersReturn {
  const {
    page: initialPage = 1,
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes default
  } = options

  const [data, setData] = useState<CoinTickerResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(initialPage)

  const fetchTickers = useCallback(async () => {
    if (!coinId) {
      setError("Coin ID is required")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const tickerData = await getCoinTickers(coinId, {
        page: currentPage,
        include_exchange_logo: true,
        order: "trust_score_desc",
      })

      setData(tickerData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch tickers"
      setError(errorMessage)
      console.error(`Error in useCoinTickers for ${coinId}:`, err)
    } finally {
      setIsLoading(false)
    }
  }, [coinId, currentPage])

  // Fetch when coinId or page changes
  useEffect(() => {
    fetchTickers()
  }, [fetchTickers])

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh || isLoading) return

    const intervalId = setInterval(() => {
      fetchTickers()
    }, refreshInterval)

    return () => clearInterval(intervalId)
  }, [autoRefresh, refreshInterval, isLoading, fetchTickers])

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1)
  }, [])

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }, [])

  return {
    data,
    isLoading,
    error,
    refetch: fetchTickers,
    nextPage,
    prevPage,
    currentPage,
  }
}
