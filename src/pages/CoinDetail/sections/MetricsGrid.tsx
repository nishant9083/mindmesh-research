import type { CoinMarketData } from "@/types"
import { formatCurrency, formatFullDate, formatPercentage, getChangeBgColor, formatCompactNumber } from "@/lib/format"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

interface MetricsGridProps {
  marketData: CoinMarketData
  currency: string
}

export function MetricsGrid({ marketData, currency }: MetricsGridProps) {
  const ath = marketData?.ath?.[currency]
  const athDate = marketData?.ath_date?.[currency]
  const athChangePercent = marketData?.ath_change_percentage?.[currency]
  
  const atl = marketData?.atl?.[currency]
  const atlDate = marketData?.atl_date?.[currency]
  const atlChangePercent = marketData?.atl_change_percentage?.[currency]
  
  const fdv = marketData?.fully_diluted_valuation?.[currency]
  const high24h = marketData?.high_24h?.[currency]
  const low24h = marketData?.low_24h?.[currency]

  return (
    <div className="bg-[#0a0b0d] border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5" />
        Key Metrics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* All-Time High */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">All-Time High</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-xl font-semibold text-white">
            {ath ? formatCurrency(ath, currency.toUpperCase()) : "N/A"}
          </div>
          {athDate && (
            <div className="text-xs text-gray-500">
              {formatFullDate(athDate)}
            </div>
          )}
          {athChangePercent !== undefined && (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getChangeBgColor(athChangePercent)}`}>
              {formatPercentage(athChangePercent, 2, true)} from ATH
            </div>
          )}
        </div>

        {/* All-Time Low */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">All-Time Low</span>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-xl font-semibold text-white">
            {atl ? formatCurrency(atl, currency.toUpperCase()) : "N/A"}
          </div>
          {atlDate && (
            <div className="text-xs text-gray-500">
              {formatFullDate(atlDate)}
            </div>
          )}
          {atlChangePercent !== undefined && (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getChangeBgColor(atlChangePercent)}`}>
              {formatPercentage(atlChangePercent, 2, true)} from ATL
            </div>
          )}
        </div>

        {/* 24h High */}
        <div className="space-y-2">
          <span className="text-sm text-gray-400">24h High</span>
          <div className="text-xl font-semibold text-white">
            {high24h ? formatCurrency(high24h, currency.toUpperCase()) : "N/A"}
          </div>
        </div>

        {/* 24h Low */}
        <div className="space-y-2">
          <span className="text-sm text-gray-400">24h Low</span>
          <div className="text-xl font-semibold text-white">
            {low24h ? formatCurrency(low24h, currency.toUpperCase()) : "N/A"}
          </div>
        </div>

        {/* Fully Diluted Valuation */}
        <div className="space-y-2">
          <span className="text-sm text-gray-400">Fully Diluted Valuation</span>
          <div className="text-xl font-semibold text-white">
            {fdv ? formatCompactNumber(fdv, 2) : "N/A"}
          </div>
          <div className="text-xs text-gray-500">
            If max supply is reached
          </div>
        </div>

        {/* Market Cap / FDV Ratio */}
        <div className="space-y-2">
          <span className="text-sm text-gray-400">Market Cap / FDV Ratio</span>
          <div className="text-xl font-semibold text-white">
            {marketData?.market_cap_fdv_ratio 
              ? (marketData.market_cap_fdv_ratio * 100).toFixed(2) + "%"
              : "N/A"}
          </div>
          <div className="text-xs text-gray-500">
            Circulating vs. fully diluted
          </div>
        </div>
      </div>
    </div>
  )
}
