import type { CoinTicker } from "@/types"
import { formatCompactNumber, formatPercentage } from "@/lib/format"
import { ExternalLink, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface TopMarketsCompactProps {
  tickers: CoinTicker[]
  isLoading: boolean
  coinSymbol: string
}

export function TopMarketsCompact({ tickers, isLoading, coinSymbol }: TopMarketsCompactProps) {
  const topTickers = tickers.slice(0, 10)
  
  // Calculate total volume to show percentage
  const totalVolume = topTickers.reduce((sum, ticker) => sum + (ticker.converted_volume?.usd ?? 0), 0)

  return (
    <div className="bg-[#0a0b0d] border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 bg-gradient-to-r from-gray-900/50 to-gray-900/20">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          {coinSymbol.toUpperCase()} Top Markets
        </h3>
      </div>

      {/* Markets List */}
      <div className="divide-y divide-gray-800/50">
        {isLoading ? (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            Loading markets...
          </div>
        ) : topTickers.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            No market data available
          </div>
        ) : (
          topTickers.map((ticker, index) => {
            const volumePercent = totalVolume > 0 
              ? (ticker.converted_volume?.usd ?? 0) / totalVolume * 100 
              : 0

            const trustScoreColor = 
              ticker.trust_score === "green" ? "text-green-500" :
              ticker.trust_score === "yellow" ? "text-yellow-500" :
              "text-gray-500"

            return (
              <div 
                key={`${ticker.market.identifier}-${ticker.base}-${ticker.target}-${index}`}
                className="px-4 py-2.5 hover:bg-gray-900/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Pair & Exchange */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Exchange Logo */}
                    {ticker.market.logo && (
                      <img 
                        src={ticker.market.logo} 
                        alt={ticker.market.name}
                        className="w-5 h-5 rounded-full flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-white truncate">
                          {ticker.base}/{ticker.target}
                        </span>
                        <div className={cn("w-1.5 h-1.5 rounded-full", trustScoreColor)} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 truncate">
                          {ticker.market.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Volume & Percentage */}
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs font-medium text-gray-300">
                      {formatPercentage(volumePercent, 1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatCompactNumber(ticker.converted_volume?.usd ?? 0, 2)}
                    </span>
                  </div>

                  {/* Link */}
                  {ticker.trade_url && (
                    <a
                      href={ticker.trade_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* View All */}
      {!isLoading && topTickers.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-800">
          <button className="text-xs text-blue-500 hover:text-blue-400 font-medium">
            View All Markets →
          </button>
        </div>
      )}
    </div>
  )
}
