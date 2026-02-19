import type { CoinTicker } from "@/types"
import { formatCompactNumber, formatNumber } from "@/lib/format"
import { ExternalLink, TrendingUp } from "lucide-react"

interface TradingPairsSectionProps {
  tickers: CoinTicker[]
  isLoading: boolean
  coinSymbol: string
}

export function TradingPairsSection({ tickers, isLoading }: TradingPairsSectionProps) {
  // Get top 10 tickers by volume
  const topTickers = tickers
    .filter((ticker) => ticker.trust_score !== "red")
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 10)

  return (
    <div className="bg-[#0a0b0d] border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Trading Pairs
        </h3>
        {tickers.length > 0 && (
          <span className="text-xs text-gray-400">
            Showing {topTickers.length} of {tickers.length} pairs
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-sm">Loading trading pairs...</div>
        </div>
      ) : topTickers.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-sm">No trading pairs available</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">
                  Exchange
                </th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">
                  Pair
                </th>
                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">
                  Price
                </th>
                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">
                  Volume (24h)
                </th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">
                  Trust
                </th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">
                  Trade
                </th>
              </tr>
            </thead>
            <tbody>
              {topTickers.map((ticker, index) => (
                <tr
                  key={`${ticker.market.identifier}-${ticker.base}-${ticker.target}-${index}`}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                >
                  {/* Exchange */}
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {ticker.market.logo && (
                        <img
                          src={ticker.market.logo}
                          alt={ticker.market.name}
                          className="w-5 h-5 rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      )}
                      <span className="text-sm text-white font-medium">
                        {ticker.market.name}
                      </span>
                    </div>
                  </td>

                  {/* Pair */}
                  <td className="py-3">
                    <span className="text-sm text-gray-300">
                      {ticker.base}/{ticker.target}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 text-right">
                    <span className="text-sm text-white font-medium">
                      ${formatNumber(ticker.last, ticker.last < 1 ? 6 : 2)}
                    </span>
                  </td>

                  {/* Volume */}
                  <td className="py-3 text-right">
                    <span className="text-sm text-gray-300">
                      {formatCompactNumber(ticker.converted_volume?.usd || ticker.volume, 2)}
                    </span>
                  </td>

                  {/* Trust Score */}
                  <td className="py-3 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        ticker.trust_score === "green"
                          ? "bg-green-500/10 text-green-500"
                          : ticker.trust_score === "yellow"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-gray-500/10 text-gray-500"
                      }`}
                    >
                      {ticker.trust_score}
                    </span>
                  </td>

                  {/* Trade Link */}
                  <td className="py-3 text-center">
                    {ticker.trade_url ? (
                      <a
                        href={ticker.trade_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-gray-600 text-xs">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {topTickers.length > 0 && tickers.length > topTickers.length && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all {tickers.length} trading pairs →
          </button>
        </div>
      )}
    </div>
  )
}
