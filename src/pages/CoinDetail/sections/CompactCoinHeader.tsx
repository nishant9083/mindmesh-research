import type { CoinDetail } from "@/types"
import {
  formatCompactNumber,
  formatCurrency,
  formatPercentage,
} from "@/lib/format"
import { cn } from "@/lib/utils"
import { Bell, Eye, ExternalLink } from "lucide-react"

interface CompactCoinHeaderProps {
  coin: CoinDetail
  currentPrice: number
  currency: string
}

export function CompactCoinHeader({
  coin,
  currentPrice,
  currency,
}: CompactCoinHeaderProps) {
  const priceChange24h =
    coin.market_data?.price_change_percentage_24h ?? 0

  const isPositive = priceChange24h >= 0

  return (
    <div className="bg-[#0a0b0d] border border-gray-800 rounded-lg px-5 py-4">

      {/* Top Row */}
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-6">

        {/* Left: Identity */}
        <div className="flex items-center gap-3 min-w-0">

          <img
            src={coin.image?.large || coin.image?.small}
            alt={coin.name}
            className="w-11 h-11 rounded-full shrink-0"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/44?text=" +
                coin.symbol.toUpperCase()
            }}
          />

          <div className="min-w-0">

            <div className="flex items-center gap-2 flex-wrap">

              <h1 className="text-lg font-semibold text-white truncate">
                {coin.name}
              </h1>

              <span className="text-sm text-gray-400 uppercase">
                {coin.symbol}
              </span>

              {coin.market_cap_rank && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-600/15 text-blue-400 border border-blue-600/25">
                  #{coin.market_cap_rank}
                </span>
              )}
            </div>

            {coin.categories?.length > 0 && (
              <div className="text-xs text-gray-500 mt-0.5 truncate">
                {coin.categories.slice(0, 2).join(" • ")}
              </div>
            )}
          </div>
        </div>

        {/* Center: Price */}
        <div className="text-center">

          <div className="text-xs text-gray-400 mb-0.5">
            Current Price
          </div>

          <div className="flex items-baseline justify-center gap-3">

            <span className="text-2xl font-bold text-white">
              {formatCurrency(
                currentPrice,
                currency.toUpperCase(),
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits:
                    currentPrice < 1 ? 6 : 2,
                }
              )}
            </span>

            <span
              className={cn(
                "text-sm font-semibold",
                isPositive
                  ? "text-green-500"
                  : "text-red-500"
              )}
            >
              {formatPercentage(priceChange24h, 2)}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-2">

          <button
            className="px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-white transition"
            title="Alert"
          >
            <Bell className="h-4 w-4" />
          </button>

          <button
            className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition"
            title="Watchlist"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Stats */}
      <div className="mt-4 pt-3 border-t border-gray-800 flex flex-wrap gap-x-6 gap-y-2 text-sm">

        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">Market Cap</span>
          <span className="text-white font-medium">
            {formatCurrency(
              coin.market_data?.market_cap?.[currency] ?? 0,
              currency.toUpperCase(),
              { notation: "compact" }
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">24h Volume</span>
          <span className="text-white font-medium">
            {formatCurrency(
              coin.market_data?.total_volume?.[currency] ?? 0,
              currency.toUpperCase(),
              { notation: "compact" }
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">Circulating Supply</span>
          <span className="text-white font-medium">
            {formatCompactNumber(
              coin.market_data?.circulating_supply ?? 0,
              2
            )}{" "}
            {coin.symbol.toUpperCase()}
          </span>
        </div>

        {/* Links */}
        <div className="ml-auto flex items-center gap-3">

          {coin.links?.homepage?.[0] && (
            <a
              href={coin.links.homepage[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {coin.links?.blockchain_site?.[0] && (
            <a
              href={coin.links.blockchain_site[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
