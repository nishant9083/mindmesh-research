import axios from "axios"
import type { 
  CoinDetail, 
  CoinTickerResponse, 
  MarketChartRange,
  SearchResponse,
  TrendingResponse
} from "@/types"

// Re-export types for convenience
export type { CoinDetail, CoinTickerResponse, SearchResponse, TrendingResponse }

export interface OHLCData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
}

const COINGECKO_BASE_URL = import.meta.env.VITE_API_BASE || "https://api.coingecko.com/api/v3"
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
  // Dynamic price change percentages based on requested time period
  price_change_percentage_24h_in_currency?: number
  price_change_percentage_7d_in_currency?: number
  price_change_percentage_30d_in_currency?: number
  price_change_percentage_200d_in_currency?: number
  price_change_percentage_1y_in_currency?: number
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

/**
 * Fetch comprehensive data for a specific coin
 * @param id - Coin ID (e.g., "bitcoin")
 * @param params - Additional parameters
 */
export async function getCoinDetail(
  id: string,
  params?: {
    localization?: boolean
    tickers?: boolean
    market_data?: boolean
    community_data?: boolean
    developer_data?: boolean
    sparkline?: boolean
  }
): Promise<CoinDetail> {
  const queryParams = {
    localization: params?.localization ?? true,
    tickers: params?.tickers ?? false,
    market_data: params?.market_data ?? true,
    community_data: params?.community_data ?? true,
    developer_data: params?.developer_data ?? true,
    sparkline: params?.sparkline ?? false,
  }

  try {
    const response = await axios.get<CoinDetail>(
      `${COINGECKO_BASE_URL}/coins/${id}`,
      {
        headers: {
          "x-cg-demo-api-key": COINGECKO_API_KEY
        },
        params: queryParams
      }
    )
    return response.data
  } catch (error) {
    console.error(`Error fetching coin detail for ${id}:`, error)
    throw error
  }
}

/**
 * Fetch trading pairs/tickers for a specific coin
 * @param id - Coin ID (e.g., "bitcoin")
 * @param params - Additional parameters
 */
export async function getCoinTickers(
  id: string,
  params?: {
    exchange_ids?: string
    include_exchange_logo?: boolean
    page?: number
    order?: string
    depth?: boolean
  }
): Promise<CoinTickerResponse> {
  const queryParams = {
    exchange_ids: params?.exchange_ids,
    include_exchange_logo: params?.include_exchange_logo ?? true,
    page: params?.page ?? 1,
    order: params?.order ?? "trust_score_desc",
    depth: params?.depth ?? false,
  }

  try {
    const response = await axios.get<CoinTickerResponse>(
      `${COINGECKO_BASE_URL}/coins/${id}/tickers`,
      {
        headers: {
          "x-cg-demo-api-key": COINGECKO_API_KEY
        },
        params: queryParams
      }
    )
    return response.data
  } catch (error) {
    console.error(`Error fetching tickers for ${id}:`, error)
    throw error
  }
}

/**
 * Fetch OHLC (candlestick) data for a specific coin
 * @param id - Coin ID (e.g., "bitcoin")
 * @param vs_currency - The target currency (default: usd)
 * @param days - Number of days (1, 7, 14, 30, 90, 180, 365, max)
 */
export async function getCoinOHLC(
  id: string,
  vs_currency: string = "usd",
  days: number = 7
): Promise<OHLCData[]> {
  try {
    const response = await axios.get<number[][]>(
      `${COINGECKO_BASE_URL}/coins/${id}/ohlc`,
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
    
    // Transform the array response to typed objects
    return response.data.map(([timestamp, open, high, low, close]) => ({
      timestamp,
      open,
      high,
      low,
      close,
    }))
  } catch (error) {
    console.error(`Error fetching OHLC data for ${id}:`, error)
    throw error
  }
}

/**
 * Fetch historical chart data for a custom date range
 * @param id - Coin ID (e.g., "bitcoin")
 * @param vs_currency - The target currency (default: usd)
 * @param from - Start timestamp (unix timestamp in seconds)
 * @param to - End timestamp (unix timestamp in seconds)
 */
export async function getCoinMarketChartRange(
  id: string,
  vs_currency: string = "usd",
  from: number,
  to: number
): Promise<MarketChartRange> {
  try {
    const response = await axios.get<MarketChartRange>(
      `${COINGECKO_BASE_URL}/coins/${id}/market_chart/range`,
      {
        headers: {
          "x-cg-demo-api-key": COINGECKO_API_KEY
        },
        params: {
          vs_currency,
          from,
          to,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error(`Error fetching market chart range for ${id}:`, error)
    throw error
  }
}

/**
 * Fetch simple price data for one or more coins
 * @param ids - Comma-separated coin IDs
 * @param vs_currencies - Comma-separated currency codes
 * @param params - Additional parameters
 */
export async function getSimplePrice(
  ids: string | string[],
  vs_currencies: string | string[] = "usd",
  params?: {
    include_market_cap?: boolean
    include_24hr_vol?: boolean
    include_24hr_change?: boolean
    include_last_updated_at?: boolean
    precision?: string
  }
): Promise<Record<string, Record<string, number>>> {
  const coinIds = Array.isArray(ids) ? ids.join(",") : ids
  const currencies = Array.isArray(vs_currencies) ? vs_currencies.join(",") : vs_currencies

  const queryParams = {
    ids: coinIds,
    vs_currencies: currencies,
    include_market_cap: params?.include_market_cap ?? false,
    include_24hr_vol: params?.include_24hr_vol ?? false,
    include_24hr_change: params?.include_24hr_change ?? false,
    include_last_updated_at: params?.include_last_updated_at ?? false,
    precision: params?.precision,
  }

  try {
    const response = await axios.get(
      `${COINGECKO_BASE_URL}/simple/price`,
      {
        headers: {
          "x-cg-demo-api-key": COINGECKO_API_KEY
        },
        params: queryParams
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching simple price:", error)
    throw error
  }
}

/**
 * Search for coins, exchanges, categories, and NFTs
 * @param query - Search query string
 */
export async function searchCoinGecko(query: string): Promise<SearchResponse> {
  if (!query || query.trim().length === 0) {
    return { coins: [], exchanges: [], categories: [], nfts: [] }
  }

  try {
    const response = await axios.get<SearchResponse>(
      `${COINGECKO_BASE_URL}/search`,
      {
        headers: {
          "x-cg-demo-api-key": COINGECKO_API_KEY
        },
        params: {
          query: query.trim()
        }
      }
    )
    return response.data
  } catch (error) {
    console.error("Error searching CoinGecko:", error)
    throw error
  }
}

/**
 * Get trending search coins, NFTs, and categories
 * Top-7 trending coins on CoinGecko as searched by users in the last 24 hours
 */
export async function getTrendingSearch(): Promise<TrendingResponse> {
  try {
    const response = await axios.get<TrendingResponse>(
      `${COINGECKO_BASE_URL}/search/trending`,
      {
        headers: {
          "x-cg-demo-api-key": COINGECKO_API_KEY
        }
      }
    )
    return response.data
  } catch (error) {
    console.error("Error fetching trending data:", error)
    throw error
  }
}


