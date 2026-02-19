import { useCoinDetail, useCoinTickers } from "@/hooks"
import { CompactCoinHeader } from "./sections/CompactCoinHeader"
import { LeftSidebarMetrics } from "./sections/LeftSidebarMetrics"
import { EnhancedChartSection } from "./sections/EnhancedChartSection"
import { TopMarketsCompact } from "./sections/TopMarketsCompact"
import { PerformanceMetrics } from "./sections/PerformanceMetrics"
import { ProfileSection } from "./sections/ProfileSection"
import { TrendingCoins } from "./sections/TrendingCoins"
import { Loader2 } from "lucide-react"

interface CoinDetailPageProps {
  coinId: string
}

export function CoinDetailPage({ coinId }: CoinDetailPageProps) {
  // Fetch coin data
  const { 
    data: coinDetail, 
    isLoading: isLoadingDetail, 
    error: detailError 
  } = useCoinDetail(coinId, { 
    autoRefresh: true,
    refreshInterval: 60000 // 1 minute
  })

  const { 
    data: tickersData, 
    isLoading: isLoadingTickers 
  } = useCoinTickers(coinId, {
    autoRefresh: true,
    refreshInterval: 300000 // 5 minutes
  })

  const currency = "usd"

  // Loading state
  if (isLoadingDetail) {
    return (
      <div className="h-full flex items-center justify-center bg-[#060709]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-400 text-sm">Loading coin data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (detailError || !coinDetail) {
    return (
      <div className="h-full flex items-center justify-center bg-[#060709]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">Error Loading Coin</h2>
          <p className="text-gray-400">{detailError || "Coin not found"}</p>
        </div>
      </div>
    )
  }

  const currentPrice = coinDetail.market_data?.current_price?.[currency] ?? 0
  const marketData = coinDetail.market_data

  return (
    <div className="h-full overflow-y-auto bg-[#060709]">
      <div className="max-w-[1800px] mx-auto px-4 py-4">
        {/* Compact Header */}
        <CompactCoinHeader 
          coin={coinDetail}
          currentPrice={currentPrice}
          currency={currency}
        />

        {/* Main 2-Column Layout */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT SIDEBAR - All Metrics & Markets (approx 30% width on lg+ screens) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4">
            {/* Compact Metrics Card */}
            <LeftSidebarMetrics
              coinName={coinDetail.name}
              symbol={coinDetail.symbol}
              marketData={marketData}
              communityData={coinDetail.community_data}
              currency={currency}
            />

            {/* Top Markets */}
            <TopMarketsCompact
              tickers={tickersData?.tickers ?? []}
              isLoading={isLoadingTickers}
              coinSymbol={coinDetail.symbol}
            />

            {/* Performance Metrics */}
            <PerformanceMetrics
              marketData={marketData}
              currency={currency}
            />

            {/* Trending Coins */}
            <TrendingCoins />
          </div>

          {/* RIGHT AREA - Charts & Profile (approx 70% width on lg+ screens) */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-4">
            {/* Enhanced Chart with Tabs */}
            <EnhancedChartSection 
              coinId={coinId}
              coinName={coinDetail.name}
              coinSymbol={coinDetail.symbol}
              currency={currency}
              tickers={tickersData?.tickers ?? []}
            />

            {/* About/Profile Section */}
            <ProfileSection coin={coinDetail} />
          </div>
        </div>
      </div>
    </div>
  )
}
