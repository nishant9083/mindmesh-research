import { useState } from "react"
// import { AssetSidebar, type AssetTab } from "@/components/layout/AssetSidebar"
import { useCoinGecko } from "@/contexts"

// Temporary type definition until AssetSidebar is implemented
type AssetTab = "overview" | "profile" | "news" | "markets"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Star,
  Info,
  ChevronUp,
  Plus,
  X,
  Maximize2,
  Download,
  MoreHorizontal,
  Calendar,
  BarChart3,
} from "lucide-react"
import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Bar,
  ComposedChart,
} from "recharts"

// Crypto metadata
const cryptoMeta: Record<string, { name: string; color: string; symbol: string; sector: string; subSector: string }> = {
  bitcoin: { name: "Bitcoin", color: "#f7931a", symbol: "BTC", sector: "Networks", subSector: "Layer-1" },
  ethereum: { name: "Ethereum", color: "#627eea", symbol: "ETH", sector: "Networks", subSector: "Layer-1" },
  tether: { name: "Tether", color: "#26a17b", symbol: "USDT", sector: "Stablecoins", subSector: "Fiat-backed" },
  ripple: { name: "XRP", color: "#00aae4", symbol: "XRP", sector: "Networks", subSector: "Layer-1" },
  binancecoin: { name: "BNB", color: "#f3ba2f", symbol: "BNB", sector: "Networks", subSector: "Layer-1" },
  "usd-coin": { name: "USDC", color: "#2775ca", symbol: "USDC", sector: "Stablecoins", subSector: "Fiat-backed" },
  solana: { name: "Solana", color: "#9945ff", symbol: "SOL", sector: "Networks", subSector: "Layer-1" },
  tron: { name: "TRON", color: "#ff0013", symbol: "TRX", sector: "Networks", subSector: "Layer-1" },
  dogecoin: { name: "Dogecoin", color: "#c3a634", symbol: "DOGE", sector: "Memecoins", subSector: "Original" },
  "bitcoin-cash": { name: "Bitcoin Cash", color: "#8dc351", symbol: "BCH", sector: "Networks", subSector: "Layer-1" },
  cardano: { name: "Cardano", color: "#0033ad", symbol: "ADA", sector: "Networks", subSector: "Layer-1" },
}

interface AssetPageProps {
  assetId: string
  onBack?: () => void
}

export function AssetPage({ assetId }: AssetPageProps) {
  const [activeTab, setActiveTab] = useState<AssetTab>("overview")
  const [chartTimeRange, setChartTimeRange] = useState<string>("1M")
  const { getCoinById, marketData, chartData, isLoadingCharts } = useCoinGecko()

  const coin = getCoinById(assetId)
  const meta = cryptoMeta[assetId] || {
    name: assetId,
    color: "#888888",
    symbol: assetId.toUpperCase(),
    sector: "Unknown",
    subSector: "Unknown",
  }

  const rank = marketData.findIndex((c) => c.id === assetId) + 1

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    if (price >= 1) return `$${price.toFixed(2)}`
    return `$${price.toFixed(4)}`
  }

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toLocaleString()}`
  }

  const formatSupply = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    return num.toLocaleString()
  }

  // Metrics data (using real data where available)
  const metrics = {
    spotVolume24h: coin?.total_volume || 17350000000,
    spotVolumeChange: -18.5,
    marketCap: coin?.market_cap || 1340000000000,
    fdv: coin?.fully_diluted_valuation || 1340000000000,
    mindshare: "Very High",
    xMetrics24h: 1067,
    circSupply: coin?.circulating_supply || 20000000,
    maxSupply: coin?.max_supply || 21000000,
    totalSupply: coin?.total_supply || 20000000,
    mcapFdv: 100.2,
    sectorRanking: 1,
    futuresVolume: 28320000000,
    openInterest: 24390000000,
    fundingRate: 0.0063,
    volatility30d: 76.48,
    unlockPercentage: 84.74,
    fees: 6620000,
    feesChange: 5.58,
    mindsharePercent: 12.8,
    mindshareChange: -1.93,
  }

  // Prepare chart data from context
  const assetChartData = chartData[assetId]
  const preparedChartData = assetChartData?.prices.map((pricePoint, index) => {
    const [timestamp, price] = pricePoint
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price,
      volume: assetChartData.total_volumes[index]?.[1] || 0,
    }
  }) || []

  return (
    <div className="h-full flex overflow-hidden">
      {/* Asset Sidebar - Commented out until component is created */}
      {/* <AssetSidebar assetId={assetId} activeTab={activeTab} onTabChange={setActiveTab} /> */}

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[#060709]">
        {/* Asset Header */}
        <div className="bg-[#0a0d14] border-b border-[#1e2738] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: meta.color }}
              >
                {coin?.image ? (
                  <img src={coin.image} alt={meta.name} className="w-10 h-10 rounded-full" />
                ) : (
                  meta.symbol.slice(0, 2)
                )}
              </div>

              {/* Name and Info */}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white">{meta.name}</h1>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{meta.sector} · {meta.subSector}</span>
                </div>
              </div>

              {/* Symbol, Rank, Mcap */}
              <div className="flex items-center gap-3 ml-4 text-sm">
                <span className="text-gray-400">{meta.symbol}</span>
                {rank > 0 && <span className="text-gray-500">#{rank}</span>}
                <span className="text-gray-500">Mcap {formatLargeNumber(metrics.marketCap)}</span>
              </div>

              {/* Price */}
              <div className="ml-6">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white">
                    {coin ? formatPrice(coin.current_price) : "$0.00"}
                  </span>
                  {coin && (
                    <span
                      className={`text-sm font-medium ${
                        (coin.price_change_percentage_24h || 0) >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {(coin.price_change_percentage_24h || 0) >= 0 ? "↑" : "↓"}
                      {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2332] border border-[#2a3548] rounded text-sm text-gray-300 hover:text-white hover:bg-[#232d3f] transition-colors">
                <Bell className="w-4 h-4" />
                Alert Me
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2332] border border-[#2a3548] rounded text-sm text-gray-300 hover:text-white hover:bg-[#232d3f] transition-colors">
                <Star className="w-4 h-4" />
                Watch
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mt-3">
            <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5">Recent Topics</Badge>
            <Badge className="bg-green-600 text-white text-xs px-2 py-0.5">Top Mindshare</Badge>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="flex gap-6">
              {/* Left Column - Metrics */}
              <div className="w-[500px] shrink-0 space-y-4">
                {/* Metrics Card */}
                <div className="space-y-3">
                  <h2 className="text-white font-semibold">{meta.symbol} Metrics</h2>

                  {/* Row 1 */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg p-3">
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        Spot Volume (24H) <Info className="w-3 h-3" />
                      </div>
                      <div className="text-white font-semibold">{formatLargeNumber(metrics.spotVolume24h)}</div>
                      <div className="text-red-400 text-xs">{metrics.spotVolumeChange}%</div>
                    </div>
                    <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg p-3">
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        Marketcap <Info className="w-3 h-3" />
                      </div>
                      <div className="text-white font-semibold">{formatLargeNumber(metrics.marketCap)}</div>
                    </div>
                    <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg p-3">
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        FDV <Info className="w-3 h-3" />
                      </div>
                      <div className="text-white font-semibold">{formatLargeNumber(metrics.fdv)}</div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg p-3">
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        Mindshare <Info className="w-3 h-3" />
                      </div>
                      <div className="text-green-400 font-semibold flex items-center gap-1">
                        {metrics.mindshare} <BarChart3 className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg p-3">
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        𝕏 Metrics (24H) <Info className="w-3 h-3" />
                      </div>
                      <div className="text-white font-semibold">{metrics.xMetrics24h.toLocaleString()} Notable Posts</div>
                    </div>
                  </div>

                  {/* Row 3 - Supply & Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Circ. Supply <Info className="w-3 h-3 inline" /></span>
                        <span className="text-white">{formatSupply(metrics.circSupply)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Max Supply <Info className="w-3 h-3 inline" /></span>
                        <span className="text-white">{formatSupply(metrics.maxSupply)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Total Supply <Info className="w-3 h-3 inline" /></span>
                        <span className="text-white">{formatSupply(metrics.totalSupply)}</span>
                      </div>
                    </div>
                    <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Sentiment <Info className="w-3 h-3 inline" /></span>
                        <span className="text-gray-400">24H ↘ 7D ↗</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Mcap/FDV <Info className="w-3 h-3 inline" /></span>
                        <span className="text-white">{metrics.mcapFdv}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Sector Ranking <Info className="w-3 h-3 inline" /></span>
                        <span className="text-white">#{metrics.sectorRanking}</span>
                      </div>
                    </div>
                  </div>

                  {/* Row 4 - Trading */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Futures Volume <Info className="w-3 h-3 inline" /></span>
                        <span className="text-white">{formatLargeNumber(metrics.futuresVolume)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Funding Rate <Info className="w-3 h-3 inline" /></span>
                        <span className="text-white">{metrics.fundingRate}%</span>
                      </div>
                    </div>
                    <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Open Interest <Info className="w-3 h-3 inline" /></span>
                        <span className="text-white">{formatLargeNumber(metrics.openInterest)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Volatility (30D) <Info className="w-3 h-3 inline" /></span>
                        <span className="text-white">{metrics.volatility30d}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unlocks Card */}
                <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold flex items-center gap-1">
                      {meta.symbol} Unlocks <Info className="w-4 h-4 text-gray-500" />
                    </h3>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Explore Unlocks
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white">{metrics.unlockPercentage}% Completed</span>
                    <div className="flex-1 h-2 bg-[#1a2332] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                        style={{ width: `${metrics.unlockPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* About Card */}
                <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg p-4">
                  <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
                    <ChevronUp className="w-4 h-4" />
                    About & Links
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    {meta.name} is the first distributed, <span className="text-blue-400 underline">consensus-based</span>, 
                    censorship-resistant, permissionless, peer-to-peer payment settlement network with a provably scarce, 
                    programmable, native currency. The {meta.name} network is an emergent decentralized monetary institution 
                    that exists through the interplay of <span className="text-blue-400 underline">full nodes</span>, 
                    <span className="text-blue-400 underline"> miners</span>, and developers. Furthermore, it is set by a 
                    social contract created and opted into by the network's users, which is hardened through 
                    <span className="text-blue-400 underline"> game theory</span> and 
                    <span className="text-blue-400 underline"> cryptography</span>.
                  </p>

                  <div className="space-y-2 pt-3 border-t border-[#1e2738]">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Sector</span>
                      <Badge className="bg-violet-600 text-white text-xs">{meta.sector}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Sector Rank</span>
                      <span className="text-white text-sm">#{metrics.sectorRanking}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Sub-Sector</span>
                      <span className="text-white text-sm">{meta.subSector}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Chart */}
              <div className="flex-1">
                <div className="bg-[#0f1118] border border-[#1e2738] rounded-lg h-full flex flex-col">
                  {/* Chart Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2738]">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <ChevronUp className="w-4 h-4" />
                      {meta.symbol} Chart
                    </h3>
                    <div className="flex items-center gap-1">
                      {["12H", "1D", "1W", "1M", "1Y", "MAX"].map((range) => (
                        <button
                          key={range}
                          onClick={() => setChartTimeRange(range)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            chartTimeRange === range
                              ? "bg-[#1a2332] text-white"
                              : "text-gray-500 hover:text-white"
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                      <button className="px-2 py-1 text-xs text-gray-500 hover:text-white flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                      </button>
                      <button className="px-2 py-1 text-xs text-gray-500 hover:text-white">More ▾</button>
                      <button className="p-1 text-gray-500 hover:text-white">
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Chart Stats Row */}
                  <div className="flex items-center gap-6 px-4 py-3 border-b border-[#1e2738]">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        Price <Info className="w-3 h-3" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{coin ? formatPrice(coin.current_price) : "$0"}</span>
                        <span className="text-green-400 text-xs">↑28.83%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        Fees <Badge className="bg-green-600 text-white text-[10px] px-1">NEW</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{formatLargeNumber(metrics.fees)}</span>
                        <span className="text-green-400 text-xs">↑{metrics.feesChange}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        Mindshare <Info className="w-3 h-3" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{metrics.mindsharePercent}%</span>
                        <span className="text-red-400 text-xs">↓{Math.abs(metrics.mindshareChange)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Asset Tags */}
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1e2738]">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#1a2332] rounded text-xs text-white border border-[#2a3548]">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: meta.color }} />
                      {meta.symbol}
                    </div>
                    <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white border border-dashed border-[#2a3548] rounded">
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                    <div className="ml-auto flex items-center gap-2">
                      <button className="p-1 text-gray-500 hover:text-white">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-white">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="flex-1 p-4 min-h-[300px]">
                    {isLoadingCharts || preparedChartData.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        {isLoadingCharts ? "Loading chart..." : "No chart data available"}
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={preparedChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e2738" />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: "#6b7280", fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            domain={["auto", "auto"]}
                            tick={{ fill: "#6b7280", fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `$${(val / 1000).toFixed(0)}K`}
                            orientation="right"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a2332",
                              border: "1px solid #2a3548",
                              borderRadius: "8px",
                            }}
                            labelStyle={{ color: "#9ca3af" }}
                            formatter={(value) => [`$${Number(value).toLocaleString()}`, "Price"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke={meta.color}
                            fill={`${meta.color}20`}
                            strokeWidth={2}
                          />
                          <Bar dataKey="volume" fill="#ef444440" barSize={4} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    )}

                    {/* Powered by label */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-gray-600 text-xs opacity-50">
                      <span>Powered by</span>
                      <span className="font-semibold">Messari</span>
                    </div>
                  </div>

                  {/* Chart Footer */}
                  <div className="flex items-center gap-2 px-4 py-2 border-t border-[#1e2738]">
                    <button className="flex items-center gap-1 px-2 py-1 bg-[#1a2332] rounded text-xs text-white">
                      Price <X className="w-3 h-3" />
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 bg-[#1a2332] rounded text-xs text-orange-400">
                      Volume <BarChart3 className="w-3 h-3" /> <X className="w-3 h-3" />
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white">
                      + Mcap <Info className="w-3 h-3" />
                    </button>
                    <div className="ml-auto">
                      <a href="#" className="text-xs text-blue-400 hover:text-blue-300">
                        More Charts →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="text-gray-500 text-center py-12">Profile content coming soon...</div>
          )}

          {activeTab === "news" && (
            <div className="text-gray-500 text-center py-12">News content coming soon...</div>
          )}

          {activeTab === "markets" && (
            <div className="text-gray-500 text-center py-12">Markets content coming soon...</div>
          )}
        </div>
      </div>
    </div>
  )
}
