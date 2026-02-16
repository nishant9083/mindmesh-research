import axios from "axios"

const COINGECKO_BASE_URL = import.meta.env.VITE_API_COINGECKO_BASE_URL || "https://api.coingecko.com/api/v3"
const COINGECKO_API_KEY = import.meta.env.VITE_API_COINGECKO_API_KEY
export interface CoinMarketData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: null | {
    times: number
    currency: string
    percentage: number
  }
  last_updated: string
  price_change_percentage_7d_in_currency?: number
}

export interface CoinHistoricalData {
  prices: [number, number][] // [timestamp, price]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

/**
 * Fetch market data for a list of coins
 * @param vs_currency - The target currency (default: usd)
 * @param order - Sort order (default: market_cap_desc)
 * @param per_page - Number of results per page (default: 100, max: 250)
 * @param page - Page number (default: 1)
 * @param sparkline - Include sparkline 7d data (default: false)
 * @param price_change_percentage - Include price change percentages (e.g., "7d")
 */
export async function getCoinMarkets(params?: {
  vs_currency?: string
  order?: string
  per_page?: number
  page?: number
  sparkline?: boolean
  price_change_percentage?: string
}): Promise<CoinMarketData[]> {
  const queryParams = {
    vs_currency: params?.vs_currency || "usd",
    order: params?.order || "market_cap_desc",
    per_page: params?.per_page || 100,
    page: params?.page || 1,
    sparkline: params?.sparkline || false,
    price_change_percentage: params?.price_change_percentage || "7d",
  }

  try {
    const response = await axios.get<CoinMarketData[]>(
      `${COINGECKO_BASE_URL}/coins/markets`,
      {headers:{
        "x-cg-demo-api-key": COINGECKO_API_KEY
      }, params: queryParams }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching coin markets:", error)
    throw error
  }
}

/**
 * Fetch historical chart data for a specific coin
 * @param id - Coin ID (e.g., "bitcoin")
 * @param vs_currency - The target currency (default: usd)
 * @param days - Number of days of data (1, 7, 14, 30, 90, 180, 365, max)
 * @param interval - Data interval (daily, hourly) - auto if not specified
 */
export async function getCoinMarketChart(
  id: string,
  vs_currency: string = "usd",
  days: string | number = "7"
): Promise<CoinHistoricalData> {
  try {
    const response = await axios.get<CoinHistoricalData>(
      `${COINGECKO_BASE_URL}/coins/${id}/market_chart`,
      {
        headers: {
          "x-cg-demo-api-key": COINGECKO_API_KEY
        },
        params: {
          vs_currency,
          days,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error(`Error fetching market chart for ${id}:`, error)
    throw error
  }
}

/**
 * Fetch historical chart data for multiple coins
 * @param coinIds - Array of coin IDs
 * @param vs_currency - The target currency (default: usd)
 * @param days - Number of days of data
 */
export async function getMultipleCoinCharts(
  coinIds: string[],
  vs_currency: string = "usd",
  days: string | number = "7"
): Promise<Record<string, CoinHistoricalData>> {
  try {
    const promises = coinIds.map((id) =>
      getCoinMarketChart(id, vs_currency, days)
    )
    const results = await Promise.all(promises)

    const chartData: Record<string, CoinHistoricalData> = {}
    coinIds.forEach((id, index) => {
      chartData[id] = results[index]
    })

    return chartData
  } catch (error) {
    console.error("Error fetching multiple coin charts:", error)
    throw error
  }
}
