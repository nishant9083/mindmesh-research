import { formatCurrency, formatPercentage } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { CoinMarketData } from "@/types"
import { Calendar } from "lucide-react"

interface PerformanceMetricsProps {
  marketData: CoinMarketData | undefined
  currency: string
}


export function PerformanceMetrics({ marketData, currency }: PerformanceMetricsProps) {
  if (!marketData) return null

  // Get key performance metrics
  const perf1Y = marketData.price_change_percentage_1y_in_currency?.[currency] ?? marketData.price_change_percentage_1y
  const perf30D = marketData.price_change_percentage_30d_in_currency?.[currency] ?? marketData.price_change_percentage_30d
  const perf7D = marketData.price_change_percentage_7d_in_currency?.[currency] ?? marketData.price_change_percentage_7d
  
  const currentPrice = marketData.current_price?.[currency] ?? 0
  const athPrice = marketData.ath?.[currency] ?? 0
  const atlPrice = marketData.atl?.[currency] ?? 0
  const athChange = marketData.ath_change_percentage?.[currency] ?? 0
  const atlChange = marketData.atl_change_percentage?.[currency] ?? 0
  
  // Calculate position on price range (0-100%)
  const priceRange = athPrice - atlPrice
  const pricePosition = priceRange > 0 ? ((currentPrice - atlPrice) / priceRange) * 100 : 50

  return (
    <div className="bg-[#0a0b0d] border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-800 bg-linear-to-r from-gray-900/50 to-gray-900/20">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-blue-500" />
          Performance
        </h3>
      </div>

      <div className="p-3 space-y-3">
        {/* Featured Performance with Range Bar */}
        <div className="bg-gray-900/30 rounded-lg p-2.5 border border-gray-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">1Y Price Performance</span>
            {perf1Y !== undefined && (
              <span className={cn(
                "text-sm font-bold",
                perf1Y >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {formatPercentage(perf1Y, 2)}
              </span>
            )}
          </div>
          
          {/* Visual Range Bar */}
          <div className="relative h-2 bg-linear-to-r from-red-600 via-yellow-600 to-green-600 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 h-full w-0.5 bg-white shadow-lg"
              style={{ left: `${Math.min(Math.max(pricePosition, 0), 100)}%` }}
            />
          </div>
          
          {/* Range Labels */}
          <div className="flex justify-between mt-1.5 text-xs">
            <span className="text-red-400 font-medium">
              {formatCurrency(atlPrice, currency.toUpperCase(), { notation: "compact", maximumFractionDigits: 2 })}
            </span>
            <span className="text-green-400 font-medium">
              {formatCurrency(athPrice, currency.toUpperCase(), { notation: "compact", maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* ATH & Cycle Low - Compact Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-900/20 rounded-md p-2 border border-gray-800/30">
            <div className="text-xs text-gray-400 mb-1">All Time High</div>
            <div className="text-sm font-bold text-white truncate">
              {formatCurrency(athPrice, currency.toUpperCase(), { maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs font-medium text-red-400">
              {formatPercentage(athChange, 2)}
            </div>
            {marketData.ath_date?.[currency] && (
              <div className="text-xs text-gray-500 mt-0.5">
                {new Date(marketData.ath_date[currency]).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
              </div>
            )}
          </div>

          <div className="bg-gray-900/20 rounded-md p-2 border border-gray-800/30">
            <div className="text-xs text-gray-400 mb-1">Cycle Low</div>
            <div className="text-sm font-bold text-white truncate">
              {formatCurrency(atlPrice, currency.toUpperCase(), {
                maximumFractionDigits: atlPrice < 1 ? 6 : 2
              })}
            </div>
            <div className="text-xs font-medium text-green-400">
              {formatPercentage(atlChange, 2)}
            </div>
            {marketData.atl_date?.[currency] && (
              <div className="text-xs text-gray-500 mt-0.5">
                {new Date(marketData.atl_date[currency]).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Performance Metrics - Ultra Compact */}
        <div className="bg-gray-900/20 rounded-md p-2 border border-gray-800/30">
          <div className="grid grid-cols-3 gap-2 text-xs">
            {perf7D !== undefined && (
              <div>
                <div className="text-gray-500">7D</div>
                <div className={cn("font-semibold", perf7D >= 0 ? "text-green-500" : "text-red-500")}>
                  {formatPercentage(perf7D, 1)}
                </div>
              </div>
            )}
            {perf30D !== undefined && (
              <div>
                <div className="text-gray-500">30D</div>
                <div className={cn("font-semibold", perf30D >= 0 ? "text-green-500" : "text-red-500")}>
                  {formatPercentage(perf30D, 1)}
                </div>
              </div>
            )}
            {perf1Y !== undefined && (
              <div>
                <div className="text-gray-500">1Y</div>
                <div className={cn("font-semibold", perf1Y >= 0 ? "text-green-500" : "text-red-500")}>
                  {formatPercentage(perf1Y, 1)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ROI if available */}
        {marketData.roi && (
          <div className="bg-blue-900/10 rounded-md p-2 border border-blue-800/30">
            <div className="text-xs text-gray-400 mb-1">Return on Investment</div>
            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-lg font-bold",
                marketData.roi.percentage >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {formatPercentage(marketData.roi.percentage, 2)}
              </span>
              <span className="text-xs text-gray-400">
                ({marketData.roi.times.toFixed(2)}x)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
