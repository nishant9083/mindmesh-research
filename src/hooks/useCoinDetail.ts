import { useState, useEffect, useCallback } from "react"
import { getCoinDetail, type CoinDetail } from "@/services/coingecko-api"

interface UseCoinDetailOptions {
  tickers?: boolean
  autoRefresh?: boolean
  refreshInterval?: number // in milliseconds
}

interface UseCoinDetailReturn {
  data: CoinDetail | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch and manage detailed coin data
 * @param coinId - The coin ID (e.g., "bitcoin")
 * @param options - Configuration options
 * @returns Coin detail data, loading state, error, and refetch function
 */
export function useCoinDetail(
  coinId: string,
  options: UseCoinDetailOptions = {}
): UseCoinDetailReturn {
  const {
    tickers = false,
    autoRefresh = false,
    refreshInterval = 60000, // 1 minute default
  } = options

  const [data, setData] = useState<CoinDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCoinDetail = useCallback(async () => {
    if (!coinId) {
      setError("Coin ID is required")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const coinData = await getCoinDetail(coinId, {
        tickers,
        market_data: true,
        community_data: true,
        developer_data: true,
        sparkline: false,
      })

      setData(coinData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch coin details"
      setError(errorMessage)
      console.error(`Error in useCoinDetail for ${coinId}:`, err)
    } finally {
      setIsLoading(false)
    }
  }, [coinId, tickers])

  // Initial fetch
  useEffect(() => {
    fetchCoinDetail()
  }, [fetchCoinDetail])

  // Auto-refresh logic
  useEffect(() => {
    if (!autoRefresh || isLoading) return

    const intervalId = setInterval(() => {
      fetchCoinDetail()
    }, refreshInterval)

    return () => clearInterval(intervalId)
  }, [autoRefresh, refreshInterval, isLoading, fetchCoinDetail])

  return {
    data,
    isLoading,
    error,
    refetch: fetchCoinDetail,
  }
}
