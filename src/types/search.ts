/**
 * CoinGecko Search API Types
 */

export interface CoinSearchResult {
  id: string
  name: string
  api_symbol: string
  symbol: string
  market_cap_rank: number | null
  thumb: string
  large: string
}

export interface ExchangeSearchResult {
  id: string
  name: string
  market_type: string
  thumb: string
  large: string
}

export interface CategorySearchResult {
  id: number
  name: string
}

export interface NFTSearchResult {
  id: string
  name: string
  symbol: string
  thumb: string
}

export interface SearchResponse {
  coins: CoinSearchResult[]
  exchanges: ExchangeSearchResult[]
  categories: CategorySearchResult[]
  nfts: NFTSearchResult[]
}
