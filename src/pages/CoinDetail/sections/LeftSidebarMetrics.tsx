import type { CoinMarketData } from "@/types"
import { formatCurrency, formatCompactNumber, formatPercentage } from "@/lib/format"
import { TrendingUp, Users, Coins, Layers, BarChart3, DollarSign } from "lucide-react"

interface LeftSidebarMetricsProps {
  coinName: string
  symbol: string
  marketData: CoinMarketData | undefined
  communityData?: {
    twitter_followers: number | null
    reddit_subscribers: number | null
  }
  currency: string
}

export function LeftSidebarMetrics({
  symbol,
  marketData,
  communityData,
  currency
}: LeftSidebarMetricsProps) {
  if (!marketData) return null

  const circulatingSupply = marketData.circulating_supply
  const totalSupply = marketData.total_supply
  const maxSupply = marketData.max_supply
  const marketCap = marketData.market_cap?.[currency] ?? 0
  const fdv = marketData.fully_diluted_valuation?.[currency] ?? 0
  const volume24h = marketData.total_volume?.[currency] ?? 0
  const volumeToMcapRatio = marketCap > 0 ? (volume24h / marketCap) * 100 : 0

  return (
    <div className="bg-[#0a0b0d] border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 bg-gradient-to-r from-gray-900/50 to-gray-900/20">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-500" />
          {symbol.toUpperCase()} Metrics
        </h3>
      </div>

      {/* Metrics - Optimized Layout */}
      <div className="p-3 space-y-2.5">
        {/* Primary Metrics - 3 Column Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-900/40 rounded-md p-2 border border-gray-800/50">
            <div className="text-xs text-gray-400 mb-0.5">Spot Vol 24h</div>
            <div className="text-sm font-bold text-white">{formatCompactNumber(volume24h, 2)}</div>
            <div className={`text-xs font-medium ${marketData.market_cap_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercentage(marketData.market_cap_change_percentage_24h ?? 0, 2)}
            </div>
          </div>

          <div className="bg-gray-900/40 rounded-md p-2 border border-gray-800/50">
            <div className="text-xs text-gray-400 mb-0.5">Market Cap</div>
            <div className="text-sm font-bold text-white">{formatCompactNumber(marketCap, 2)}</div>
            <div className="text-xs text-gray-500">#{marketData.market_cap_rank || "-"}</div>
          </div>

          {fdv > 0 && (
            <div className="bg-gray-900/40 rounded-md p-2 border border-gray-800/50">
              <div className="text-xs text-gray-400 mb-0.5">FDV</div>
              <div className="text-sm font-bold text-white">{formatCompactNumber(fdv, 2)}</div>
            </div>
          )}
        </div>

        {/* Supply Metrics - Compact Row */}
        <div className="bg-gray-900/20 rounded-md p-2 border border-gray-800/30">
          <div className="text-xs font-semibold text-gray-300 mb-1.5">Supply</div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Circulating</span>
              <span className="text-xs font-medium text-white">{formatCompactNumber(circulatingSupply)}</span>
            </div>
            {maxSupply && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Max</span>
                <span className="text-xs font-medium text-white">{formatCompactNumber(maxSupply)}</span>
              </div>
            )}
            {totalSupply && totalSupply !== maxSupply && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Total</span>
                <span className="text-xs font-medium text-white">{formatCompactNumber(totalSupply)}</span>
              </div>
            )}
            {maxSupply && (
              <div className="flex justify-between items-center pt-1 border-t border-gray-800/50">
                <span className="text-xs text-gray-400">% of Max</span>
                <span className="text-xs font-medium text-blue-400">{((circulatingSupply / maxSupply) * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Ratios - Compact Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-900/20 rounded-md p-2 border border-gray-800/30">
            <div className="text-xs text-gray-400">Vol/Mcap</div>
            <div className="text-sm font-semibold text-white">{volumeToMcapRatio.toFixed(2)}%</div>
          </div>
          {fdv > 0 && marketData.market_cap_fdv_ratio && (
            <div className="bg-gray-900/20 rounded-md p-2 border border-gray-800/30">
              <div className="text-xs text-gray-400">Mcap/FDV</div>
              <div className="text-sm font-semibold text-white">{formatPercentage(marketData.market_cap_fdv_ratio * 100, 1)}</div>
            </div>
          )}
        </div>

        {/* ATH & ATL - Highlighted Cards */}
        {(marketData.ath?.[currency] || marketData.atl?.[currency]) && (
          <div className="grid grid-cols-2 gap-2">
            {marketData.ath?.[currency] && (
              <div className="bg-green-900/10 rounded-md p-2 border border-green-800/30">
                <div className="text-xs text-gray-400">ATH</div>
                <div className="text-sm font-bold text-white truncate">
                  {formatCurrency(marketData.ath[currency], currency.toUpperCase(), { maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs font-medium text-red-400">
                  {formatPercentage(marketData.ath_change_percentage?.[currency] ?? 0, 1)}
                </div>
              </div>
            )}

            {marketData.atl?.[currency] && (
              <div className="bg-red-900/10 rounded-md p-2 border border-red-800/30">
                <div className="text-xs text-gray-400">ATL</div>
                <div className="text-sm font-bold text-white truncate">
                  {formatCurrency(marketData.atl[currency], currency.toUpperCase(), {
                    maximumFractionDigits: marketData.atl[currency] < 1 ? 6 : 2
                  })}
                </div>
                <div className="text-xs font-medium text-green-400">
                  {formatPercentage(marketData.atl_change_percentage?.[currency] ?? 0, 1)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Social Metrics - Ultra Compact */}
        {(communityData?.twitter_followers || communityData?.reddit_subscribers) && (
          <div className="bg-gray-900/20 rounded-md p-2 border border-gray-800/30">
            <div className="text-xs font-semibold text-gray-300 mb-1">Community</div>
            <div className="flex items-center justify-between gap-3">
              {communityData?.twitter_followers && (
                <div className="flex items-center gap-1.5 flex-1">
                  <Users className="h-3 w-3 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Twitter</div>
                    <div className="text-xs font-medium text-white">{formatCompactNumber(communityData.twitter_followers)}</div>
                  </div>
                </div>
              )}
              {communityData?.reddit_subscribers && (
                <div className="flex items-center gap-1.5 flex-1">
                  <Users className="h-3 w-3 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Reddit</div>
                    <div className="text-xs font-medium text-white">{formatCompactNumber(communityData.reddit_subscribers)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
