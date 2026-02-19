import type { CoinMarketData } from "@/types"
import { formatPercentage, getChangeBgColor } from "@/lib/format"
import { calculatePricePerformance } from "@/lib/calculations"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MarketDataSectionProps {
  marketData: CoinMarketData
  currentPrice: number
  currency: string
}

export function MarketDataSection({ marketData, currentPrice, currency }: MarketDataSectionProps) {
  const performance = calculatePricePerformance(currentPrice, marketData, currency)
  const roi = marketData?.roi

  const getIcon = (changePercent: number) => {
    if (changePercent > 0) return <TrendingUp className="h-4 w-4" />
    if (changePercent < 0) return <TrendingDown className="h-4 w-4" />
    return <Minus className="h-4 w-4" />
  }

  return (
    <div className="bg-[#0a0b0d] border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Price Performance</h3>
      
      {/* Performance Grid */}
      <div className="space-y-3">
        {performance.map((perf, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{perf.period}</span>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getChangeBgColor(perf.changePercent)}`}>
              {getIcon(perf.changePercent)}
              <span className="text-sm font-medium">
                {formatPercentage(perf.changePercent, 2, true)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ROI */}
      {roi && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Return on Investment (ROI)
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">ROI</span>
              <span className={`text-sm font-semibold ${roi.percentage > 0 ? "text-green-500" : "text-red-500"}`}>
                {formatPercentage(roi.percentage, 2, true)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Multiplier</span>
              <span className="text-sm font-semibold text-white">
                {roi.times.toFixed(2)}x
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Currency</span>
              <span className="text-sm font-semibold text-white uppercase">
                {roi.currency}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Supply Information */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Supply Details
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Circulating</span>
            <span className="text-sm font-semibold text-white">
              {marketData?.circulating_supply?.toLocaleString() || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Total Supply</span>
            <span className="text-sm font-semibold text-white">
              {marketData?.total_supply?.toLocaleString() || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Max Supply</span>
            <span className="text-sm font-semibold text-white">
              {marketData?.max_supply?.toLocaleString() || "∞"}
            </span>
          </div>
        </div>

        {/* Supply Progress Bar */}
        {marketData?.max_supply && marketData?.circulating_supply && (
          <div className="mt-4">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (marketData.circulating_supply / marketData.max_supply) * 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {((marketData.circulating_supply / marketData.max_supply) * 100).toFixed(1)}% Circulating
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
