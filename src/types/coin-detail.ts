/**
 * Comprehensive coin detail types based on CoinGecko API /coins/{id} endpoint
 */

export interface CoinDetail {
  id: string
  symbol: string
  name: string
  web_slug?: string
  asset_platform_id: string | null
  platforms: Record<string, string>
  
  // Block chain explorers
  detail_platforms: Record<string, {
    decimal_place: number | null
    contract_address: string
  }>
  
  // Block time in minutes
  block_time_in_minutes: number
  hashing_algorithm: string | null
  
  // Categories
  categories: string[]
  
  // Preview type (if available)
  preview_listing: boolean
  
  // Localized description
  description: {
    en: string
    [key: string]: string
  }
  
  // Links
  links: {
    homepage: string[]
    whitepaper: string
    blockchain_site: string[]
    official_forum_url: string[]
    chat_url: string[]
    announcement_url: string[]
    twitter_screen_name: string
    facebook_username: string
    bitcointalk_thread_identifier: string | null
    telegram_channel_identifier: string
    subreddit_url: string
    repos_url: {
      github: string[]
      bitbucket: string[]
    }
  }
  
  // Image URLs
  image: {
    thumb: string
    small: string
    large: string
  }
  
  // Country of origin
  country_origin: string
  
  // Genesis date
  genesis_date: string | null
  
  // Sentiment votes
  sentiment_votes_up_percentage: number
  sentiment_votes_down_percentage: number
  
  // Watchlist portfolio users
  watchlist_portfolio_users: number
  
  // Market cap rank
  market_cap_rank: number
  
  // Market data
  market_data: CoinMarketData
  
  // Community data
  community_data: {
    facebook_likes: number | null
    twitter_followers: number | null
    reddit_average_posts_48h: number
    reddit_average_comments_48h: number
    reddit_subscribers: number | null
    reddit_accounts_active_48h: number
    telegram_channel_user_count: number | null
  }
  
  // Developer data
  developer_data: {
    forks: number
    stars: number
    subscribers: number
    total_issues: number
    closed_issues: number
    pull_requests_merged: number
    pull_request_contributors: number
    code_additions_deletions_4_weeks: {
      additions: number
      deletions: number
    }
    commit_count_4_weeks: number
    last_4_weeks_commit_activity_series: number[]
  }
  
  // Status updates
  status_updates: any[]
  
  // Last updated
  last_updated: string
  
  // Tickers
  tickers?: CoinTicker[]
}

export interface CoinMarketData {
  // Current price in various currencies
  current_price: Record<string, number>
  
  // Total value locked (DeFi)
  total_value_locked: number | null
  
  // Market cap to TVL ratio
  mcap_to_tvl_ratio: number | null
  
  // FDV to TVL ratio
  fdv_to_tvl_ratio: number | null
  
  // Return on investment
  roi: {
    times: number
    currency: string
    percentage: number
  } | null
  
  // All-time high
  ath: Record<string, number>
  ath_change_percentage: Record<string, number>
  ath_date: Record<string, string>
  
  // All-time low
  atl: Record<string, number>
  atl_change_percentage: Record<string, number>
  atl_date: Record<string, string>
  
  // Market cap
  market_cap: Record<string, number>
  market_cap_rank: number
  fully_diluted_valuation: Record<string, number>
  market_cap_fdv_ratio: number
  
  // Total volume
  total_volume: Record<string, number>
  
  // 24h high/low
  high_24h: Record<string, number>
  low_24h: Record<string, number>
  
  // Price change
  price_change_24h: number
  price_change_percentage_24h: number
  price_change_percentage_7d: number
  price_change_percentage_14d: number
  price_change_percentage_30d: number
  price_change_percentage_60d: number
  price_change_percentage_200d: number
  price_change_percentage_1y: number
  
  // Market cap change
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  
  // Price change in various currencies
  price_change_24h_in_currency: Record<string, number>
  price_change_percentage_1h_in_currency: Record<string, number>
  price_change_percentage_24h_in_currency: Record<string, number>
  price_change_percentage_7d_in_currency: Record<string, number>
  price_change_percentage_14d_in_currency: Record<string, number>
  price_change_percentage_30d_in_currency: Record<string, number>
  price_change_percentage_60d_in_currency: Record<string, number>
  price_change_percentage_200d_in_currency: Record<string, number>
  price_change_percentage_1y_in_currency: Record<string, number>
  
  // Market cap change in various currencies
  market_cap_change_24h_in_currency: Record<string, number>
  market_cap_change_percentage_24h_in_currency: Record<string, number>
  
  // Total supply
  total_supply: number | null
  max_supply: number | null
  circulating_supply: number
  
  // Last updated
  last_updated: string
}

export interface CoinTicker {
  base: string
  target: string
  market: {
    name: string
    identifier: string
    has_trading_incentive: boolean
    logo: string
  }
  last: number
  volume: number
  converted_last: Record<string, number>
  converted_volume: Record<string, number>
  trust_score: string
  bid_ask_spread_percentage: number
  timestamp: string
  last_traded_at: string
  last_fetch_at: string
  is_anomaly: boolean
  is_stale: boolean
  trade_url: string | null
  token_info_url: string | null
  coin_id: string
  target_coin_id?: string
}

export interface CoinTickerResponse {
  name: string
  tickers: CoinTicker[]
}

export interface OHLCData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
}

export interface MarketChartRange {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

// Utility types for component props
export interface PricePerformance {
  period: string
  change: number
  changePercent: number
}

export interface SupplyInfo {
  circulating: number
  total: number | null
  max: number | null
  percentCirculating: number
}

export interface MetricCardData {
  label: string
  value: string | number
  change?: number
  subValue?: string
  timestamp?: string
  isPositive?: boolean
}
