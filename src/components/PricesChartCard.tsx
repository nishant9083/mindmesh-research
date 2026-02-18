import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search, TrendingUp, Eye, Layers, Globe, X, Plus, Maximize2, Download } from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { useCoinGecko, type TimeRange } from "@/contexts"

// Crypto metadata with colors
const cryptoMeta: Record<string, { name: string; color: string }> = {
  bitcoin: { name: "Bitcoin", color: "#f7931a" },
  ethereum: { name: "Ethereum", color: "#627eea" },
  tether: { name: "Tether", color: "#26a17b" },
  ripple: { name: "XRP", color: "#00aae4" },
  binancecoin: { name: "BNB", color: "#f3ba2f" },
  "usd-coin": { name: "USDC", color: "#2775ca" },
  solana: { name: "Solana", color: "#9945ff" },
  tron: { name: "TRON", color: "#ff0013" },
  dogecoin: { name: "Dogecoin", color: "#c3a634" },
  "bitcoin-cash": { name: "Bitcoin Cash", color: "#8dc351" },
  cardano: { name: "Cardano", color: "#0033ad" },
}

// Map CoinGecko ID to symbol
const coinIdToSymbol: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  tether: "USDT",
  ripple: "XRP",
  binancecoin: "BNB",
  "usd-coin": "USDC",
  solana: "SOL",
  tron: "TRX",
  dogecoin: "DOGE",
  "bitcoin-cash": "BCH",
  cardano: "ADA",
}

type FilterCategory = "Top Assets" | "Watchlists" | "Sectors" | "Ecosystems"
type FilterOption = "Top 100" | "Gainers" | "Losers"

const filterCategories: { category: FilterCategory; icon: React.ReactNode; options?: FilterOption[] }[] = [
  { category: "Top Assets", icon: <TrendingUp className="h-3.5 w-3.5" />, options: ["Top 100", "Gainers", "Losers"] },
  { category: "Watchlists", icon: <Eye className="h-3.5 w-3.5" /> },
  { category: "Sectors", icon: <Layers className="h-3.5 w-3.5" /> },
  { category: "Ecosystems", icon: <Globe className="h-3.5 w-3.5" /> },
]

// Chart tab options
type ChartTab = "Price" | "Volume" | "Mcap"
type ChartType = "line" | "area" | "bar"

interface PricesChartCardProps {
  onAssetClick?: (assetId: string) => void
}

export function PricesChartCard({ onAssetClick }: PricesChartCardProps) {
  // Use CoinGecko Context
  const {
    marketData,
    isLoadingMarkets,
    marketError,
    chartData,
    isLoadingCharts,
    selectedAssets,
    toggleAsset,
    timeRange,
    setTimeRange,
  } = useCoinGecko()

  // Local UI state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("Top 100")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeChartTab, setActiveChartTab] = useState<ChartTab>("Price")
  const [chartType, setChartType] = useState<ChartType>("area")
  const [showPercentage, setShowPercentage] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Rename for component consistency
  const isLoading = isLoadingMarkets
  const error = marketError
  const isChartLoading = isLoadingCharts

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter data based on search and selected filter
  const filteredData = marketData.filter((coin) => {
    const matchesSearch = coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (selectedFilter === "Gainers") return (coin.price_change_percentage_7d_in_currency || 0) > 0
    if (selectedFilter === "Losers") return (coin.price_change_percentage_7d_in_currency || 0) < 0
    return true // Top 100
  })

  const handleFilterSelect = (option: FilterOption) => {
    setSelectedFilter(option)
    setIsDropdownOpen(false)
  }

  const toggleAssetSelection = (coinId: string) => {
    toggleAsset(coinId)
  }

  const removeAsset = (coinId: string) => {
    toggleAsset(coinId)
  }

  // Format price for display
  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    if (price >= 1) return `$${price.toFixed(2)}`
    if (price >= 0.01) return `$${price.toFixed(4)}`
    return `$${price.toFixed(6)}`
  }

  // Format market cap for display
  const formatMarketCap = (mcap: number) => {
    if (mcap >= 1e12) return `$${(mcap / 1e12).toFixed(2)}T`
    if (mcap >= 1e9) return `$${(mcap / 1e9).toFixed(2)}B`
    return `$${(mcap / 1e6).toFixed(2)}M`
  }

  // Prepare chart data
  const prepareChartData = () => {
    if (selectedAssets.length === 0 || Object.keys(chartData).length === 0) return []

    // Get the first asset's timestamps as the base
    const firstAssetId = selectedAssets[0]
    const firstAssetData = chartData[firstAssetId]

    if (!firstAssetData) return []

    // Store initial values for percentage calculation
    const initialValues: Record<string, number> = {}
    selectedAssets.forEach((coinId) => {
      const assetData = chartData[coinId]
      if (assetData && assetData.prices.length > 0) {
        if (activeChartTab === "Price") {
          initialValues[coinId] = assetData.prices[0][1]
        } else if (activeChartTab === "Volume") {
          initialValues[coinId] = assetData.total_volumes[0][1]
        } else {
          initialValues[coinId] = assetData.market_caps[0][1]
        }
      }
    })

    const dataPoints = firstAssetData.prices.map((pricePoint, index) => {
      const [timestamp] = pricePoint
      const date = new Date(timestamp)
      const dataPoint: Record<string, number | string> = {
        timestamp,
        date: timeRange === "1D"
          ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          : date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        date_full: date.toLocaleString("en-US", { month: "short", day: "numeric", year: "2-digit", hour: "2-digit", minute: "2-digit" }),
      }

      selectedAssets.forEach((coinId) => {
        const assetData = chartData[coinId]
        if (assetData) {
          let value = 0
          if (activeChartTab === "Price") {
            value = assetData.prices[index]?.[1] || 0
          } else if (activeChartTab === "Volume") {
            value = assetData.total_volumes[index]?.[1] || 0
          } else {
            value = assetData.market_caps[index]?.[1] || 0
          }

          // If percentage mode, calculate percentage change from initial value
          if (showPercentage && initialValues[coinId]) {
            dataPoint[coinId] = ((value - initialValues[coinId]) / initialValues[coinId]) * 100
          } else {
            dataPoint[coinId] = value
          }

          // Add volume data for overlay
          if (showVolume && activeChartTab === "Price") {
            dataPoint[`${coinId}_volume`] = assetData.total_volumes[index]?.[1] || 0
          }
        }
      })

      return dataPoint
    })

    return dataPoints
  }

  const preparedChartData = prepareChartData()

  // Calculate percentage change for chart labels
  const getAssetChange = (coinId: string) => {
    const data = chartData[coinId]
    if (!data || data.prices.length < 2) return { value: "0%", positive: true }
    const first = data.prices[0][1]
    const last = data.prices[data.prices.length - 1][1]
    const change = ((last - first) / first) * 100
    return {
      value: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
      positive: change >= 0,
    }
  }

  return (
    <Card className="bg-[#0f1118] border-[#1e2738] h-full py-0 flex flex-col">
      <CardHeader className="pb-2 pt-4 px-4 border-[#1e2738] bg-[#181b28] rounded-t-xl shrink-0">
        <CardTitle className="text-white text-base font-medium">Prices & Chart</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-row overflow-hidden">
        <div className="w-1/3 p-0 flex flex-col overflow-hidden border-r border-[#1e2738]">
          {/* Filter bar */}
          <div className="flex items-center gap-2 px-3 py-2 ">
            {/* Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1a2332] rounded border border-[#2a3548] text-xs text-white hover:bg-[#232d3f] transition-colors"
              >
                <TrendingUp className="h-3 w-3 text-gray-400" />
                <span>{selectedFilter}</span>
                <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-[#1a2332] border border-[#2a3548] rounded-lg shadow-xl z-50 overflow-hidden">
                  {filterCategories.map((cat) => (
                    <div key={cat.category}>
                      <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:bg-[#232d3f]">
                        {cat.icon}
                        <span>{cat.category}</span>
                      </div>
                      {cat.options && (
                        <div className="pl-6">
                          {cat.options.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleFilterSelect(option)}
                              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#232d3f] flex items-center gap-2 ${selectedFilter === option ? "text-blue-400" : "text-gray-300"
                                }`}
                            >
                              {selectedFilter === option && <span className="text-blue-400">✓</span>}
                              <span className={selectedFilter === option ? "" : "pl-4"}>{option}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search the table below"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a2332] border border-[#2a3548] rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#3a4558]"
              />
            </div>
          </div>

          {/* Scroll Container */}
          <div className="flex-1 overflow-auto min-h-0">

            <table className="w-full text-xs border-collapse">

              {/* Table Header */}
              <thead className="sticky top-0 bg-[#0f1118] z-20 border-b-2 border-[#1e2738]">
                <tr className="text-gray-500 border-b border-[#1e2738]">

                  <th className="w-8 px-2 py-2 text-left font-normal">
                    #
                  </th>

                  <th className="w-17.5 text-left px-2 py-2 font-normal">
                    Asset
                  </th>

                  <th className="w-17.5 px-2 py-2 text-right font-normal">
                    Price
                  </th>

                  <th className="w-15 px-2 py-2 text-right font-normal">
                    1W
                  </th>

                  <th className="w-17.5 px-2 py-2 text-right font-normal">
                    Mcap
                  </th>

                </tr>
              </thead>


              {/* Table Body */}
              <tbody className="divide-y divide-[#1e2738]">

                {/* Loading */}
                {isLoading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-32 text-center text-gray-500"
                    >
                      Loading market data...
                    </td>
                  </tr>
                )}

                {/* Error */}
                {error && (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-32 text-center text-red-500"
                    >
                      {error}
                    </td>
                  </tr>
                )}


                {/* Data Rows */}
                {!isLoading && !error && filteredData.map((coin) => {

                  const symbol =
                    coinIdToSymbol[coin.id] || coin.symbol.toUpperCase()

                  const color =
                    cryptoMeta[coin.id]?.color || "#888888"

                  const changePercent =
                    coin.price_change_percentage_7d_in_currency || 0

                  const positive = changePercent >= 0

                  const selected =
                    selectedAssets.includes(coin.id)


                  return (
                    <tr
                      key={coin.id}
                      onClick={() => toggleAssetSelection(coin.id)}
                      className={`
                cursor-pointer transition-colors
                ${selected
                          ? "bg-[#1a2332] border-l-2 border-blue-500"
                          : "hover:bg-[#1a2332]"
                        }
              `}
                    >

                      {/* Rank */}
                      <td className="px-2 py-2.5 text-gray-500">
                        {coin.market_cap_rank || "-"}
                      </td>


                      {/* Asset */}
                      <td className="px-2 py-2.5 text-white font-medium">
                        <div className="flex items-center gap-2">

                          {coin.image ? (
                            <img
                              src={coin.image}
                              alt={symbol}
                              className="w-5 h-5 rounded-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                              style={{ backgroundColor: color }}
                            >
                              {symbol.charAt(0)}
                            </span>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onAssetClick?.(coin.id)
                            }}
                            className="hover:text-blue-400 hover:underline transition-colors"
                          >
                            {symbol}
                          </button>
                        </div>
                      </td>


                      {/* Price */}
                      <td className="px-2 py-2.5 text-white text-right">
                        {formatPrice(coin.current_price)}
                      </td>


                      {/* 1W */}
                      <td
                        className={`px-2 py-2.5 text-right ${positive
                          ? "text-green-400"
                          : "text-red-400"
                          }`}
                      >
                        {positive ? "+" : ""}
                        {changePercent.toFixed(2)}%
                      </td>


                      {/* Market Cap */}
                      <td className="px-2 py-2.5 text-blue-400 text-right">
                        {formatMarketCap(coin.market_cap)}
                      </td>

                    </tr>
                  )
                })}
              </tbody>

            </table>

          </div>
        </div>

        {/* Chart Section */}
        <div className="w-2/3 flex flex-col overflow-hidden">
          {/* Chart Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e2738] shrink-0">
            <div className="flex items-center gap-2">
              {/* Chart type icons */}
              <button
                onClick={() => setChartType("line")}
                className={`p-1.5 rounded transition-colors ${chartType === "line" ? "bg-[#2a3548] text-blue-400" : "text-gray-400 hover:bg-[#1a2332] hover:text-white"}`}
                title="Line Chart"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 17l5-5 4 4 9-9" />
                </svg>
              </button>
              <button
                onClick={() => setChartType("area")}
                className={`p-1.5 rounded transition-colors ${chartType === "area" ? "bg-[#2a3548] text-blue-400" : "text-gray-400 hover:bg-[#1a2332] hover:text-white"}`}
                title="Area Chart"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 17l5-5 4 4 9-9" />
                  <path d="M3 17h18v4H3z" fill="currentColor" opacity="0.3" />
                </svg>
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`p-1.5 rounded transition-colors ${chartType === "bar" ? "bg-[#2a3548] text-blue-400" : "text-gray-400 hover:bg-[#1a2332] hover:text-white"}`}
                title="Bar Chart"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="10" width="4" height="10" />
                  <rect x="10" y="5" width="4" height="15" />
                  <rect x="17" y="8" width="4" height="12" />
                </svg>
              </button>

              <div className="w-px h-4 bg-[#2a3548] mx-1" />

              {/* Chart data tabs */}
              {(["Price", "Volume", "Mcap"] as ChartTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveChartTab(tab)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${activeChartTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-[#1a2332]"
                    }`}
                >
                  {tab}
                </button>
              ))}

              <div className="w-px h-4 bg-[#2a3548] mx-1" />

              {/* Time range selector */}
              {(["1D", "7D", "30D", "90D", "1Y", "Max"] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${timeRange === range
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-[#1a2332]"
                    }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Percentage toggle */}
              <button
                onClick={() => setShowPercentage(!showPercentage)}
                className={`px-3 py-1 text-xs rounded transition-colors ${showPercentage
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#1a2332]"
                  }`}
                title="Show as percentage change"
              >
                %
              </button>

              {/* Volume overlay toggle */}
              {activeChartTab === "Price" && (
                <button
                  onClick={() => setShowVolume(!showVolume)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${showVolume
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-[#1a2332]"
                    }`}
                  title="Show volume overlay"
                >
                  Vol
                </button>
              )}

              {/* Additional actions */}
              <button
                className="p-1.5 rounded text-gray-400 hover:bg-[#1a2332] hover:text-white transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                className="p-1.5 rounded text-gray-400 hover:bg-[#1a2332] hover:text-white transition-colors"
                title="Download chart"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Selected Assets Tags */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1e2738] shrink-0 flex-wrap">
            {selectedAssets.map((coinId) => {
              const symbol = coinIdToSymbol[coinId] || coinId.toUpperCase()
              const color = cryptoMeta[coinId]?.color || "#888888"

              return (
                <span
                  key={coinId}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs text-white"
                  style={{ backgroundColor: `${color}33`, borderLeft: `3px solid ${color}` }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                  {symbol}
                  <button
                    onClick={() => removeAsset(coinId)}
                    className="ml-0.5 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
            <button className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-[#1a2332] border border-dashed border-[#2a3548]">
              <Plus className="w-3 h-3" />
              Add
            </button>
          </div>

          {/* Chart Area */}
          <div className="flex-1 p-4 min-h-0 relative">
            {selectedAssets.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Select assets from the table to view chart
              </div>
            ) : isChartLoading ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span>Loading chart data...</span>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={preparedChartData} margin={{ top: 20, right: 80, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#4a5568"
                      tick={{ fill: "#718096", fontSize: 11 }}
                      axisLine={{ stroke: "#2a3548" }}
                      tickLine={false}
                      // interval="equidistantPreserveEnd"
                      minTickGap={50}
                    />
                    <YAxis
                      stroke="#4a5568"
                      tick={{ fill: "#718096", fontSize: 11 }}
                      axisLine={{ stroke: "#2a3548" }}
                      tickLine={false}
                      tickFormatter={(value) => {
                        if (showPercentage) return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
                        if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
                        if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
                        if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
                        return `$${value.toFixed(2)}`
                      }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload || payload.length === 0) return null
                        const dateFull = payload[0]?.payload?.date_full || label
                        return (
                          <div className="bg-[#1a2332] border border-[#2a3548] rounded-lg p-3 shadow-xl">
                            <p className="text-white text-xs font-medium mb-2">{dateFull}</p>
                            {payload.map((entry: any) => {
                              const coinId = entry.dataKey
                              const symbol = coinIdToSymbol[coinId] || coinId.toUpperCase()
                              const color = entry.stroke || entry.fill
                              const value = entry.value

                              return (
                                <div key={coinId} className="flex items-center justify-between gap-4 text-xs mb-1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="text-gray-300">{symbol}</span>
                                  </div>
                                  <span className="text-white font-medium">
                                    {showPercentage
                                      ? `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
                                      : formatPrice(value)
                                    }
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        )
                      }}
                    />
                    {selectedAssets.map((coinId) => (
                      <Line
                        key={coinId}
                        type="monotone"
                        dataKey={coinId}
                        stroke={cryptoMeta[coinId]?.color || "#888"}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5, strokeWidth: 2 }}
                        animationDuration={800}
                      />
                    ))}
                  </LineChart>
                ) : chartType === "area" ? (
                  <AreaChart data={preparedChartData} margin={{ top: 20, right: 80, left: 10, bottom: 20 }}>
                    <defs>
                      {selectedAssets.map((coinId) => {
                        const color = cryptoMeta[coinId]?.color || "#888"
                        return (
                          <linearGradient key={`gradient-${coinId}`} id={`gradient-${coinId}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                          </linearGradient>
                        )
                      })}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#4a5568"
                      tick={{ fill: "#718096", fontSize: 11 }}
                      axisLine={{ stroke: "#2a3548" }}
                      tickLine={false}
                      // interval="preserveStartEnd"
                      minTickGap={50}
                    />
                    <YAxis
                      stroke="#4a5568"
                      tick={{ fill: "#718096", fontSize: 11 }}
                      axisLine={{ stroke: "#2a3548" }}
                      tickLine={false}
                      tickFormatter={(value) => {
                        if (showPercentage) return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
                        if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
                        if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
                        if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
                        return `$${value.toFixed(2)}`
                      }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload || payload.length === 0) return null
                        const dateFull = payload[0]?.payload?.date_full || label
                        return (
                          <div className="bg-[#1a2332] border border-[#2a3548] rounded-lg p-3 shadow-xl">
                            <p className="text-white text-xs font-medium mb-2">{dateFull}</p>
                            {payload.map((entry: any) => {
                              const coinId = entry.dataKey
                              const symbol = coinIdToSymbol[coinId] || coinId.toUpperCase()
                              const color = entry.stroke || entry.fill
                              const value = entry.value

                              return (
                                <div key={coinId} className="flex items-center justify-between gap-4 text-xs mb-1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="text-gray-300">{symbol}</span>
                                  </div>
                                  <span className="text-white font-medium">
                                    {showPercentage
                                      ? `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
                                      : formatPrice(value)
                                    }
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        )
                      }}
                    />
                    {selectedAssets.map((coinId) => (
                      <Area
                        key={coinId}
                        type="monotone"
                        dataKey={coinId}
                        stroke={cryptoMeta[coinId]?.color || "#888"}
                        strokeWidth={2.5}
                        fill={`url(#gradient-${coinId})`}
                        dot={false}
                        activeDot={{ r: 5, strokeWidth: 2 }}
                        animationDuration={800}
                      />
                    ))}
                  </AreaChart>
                ) : (
                  <BarChart data={preparedChartData} margin={{ top: 20, right: 80, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3548" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#4a5568"
                      tick={{ fill: "#718096", fontSize: 11 }}
                      axisLine={{ stroke: "#2a3548" }}
                      tickLine={false}
                      // interval="0"
                      minTickGap={50}
                    />
                    <YAxis
                      stroke="#4a5568"
                      tick={{ fill: "#718096", fontSize: 11 }}
                      axisLine={{ stroke: "#2a3548" }}
                      tickLine={false}
                      tickFormatter={(value) => {
                        if (showPercentage) return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`
                        if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
                        if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
                        if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
                        return `$${value.toFixed(2)}`
                      }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload || payload.length === 0) return null
                        const dateFull = payload[0]?.payload?.date_full || label
                        return (
                          <div className="bg-[#1a2332] border border-[#2a3548] rounded-lg p-3 shadow-xl">
                            <p className="text-white text-xs font-medium mb-2">{dateFull}</p>
                            {payload.map((entry: any) => {
                              const coinId = entry.dataKey
                              const symbol = coinIdToSymbol[coinId] || coinId.toUpperCase()
                              const color = entry.fill
                              const value = entry.value

                              return (
                                <div key={coinId} className="flex items-center justify-between gap-4 text-xs mb-1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                    <span className="text-gray-300">{symbol}</span>
                                  </div>
                                  <span className="text-white font-medium">
                                    {showPercentage
                                      ? `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
                                      : formatPrice(value)
                                    }
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        )
                      }}
                    />
                    {selectedAssets.map((coinId) => (
                      <Bar
                        key={coinId}
                        dataKey={coinId}
                        fill={cryptoMeta[coinId]?.color || "#888"}
                        opacity={0.8}
                        animationDuration={800}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                  </BarChart>
                )}
              </ResponsiveContainer>
            )}

            {/* Chart Statistics/Legend */}
            {selectedAssets.length > 0 && !isChartLoading && (
              <div className="absolute right-4 top-4 flex flex-col gap-2">
                {selectedAssets.map((coinId) => {
                  const symbol = coinIdToSymbol[coinId] || coinId.toUpperCase()
                  const color = cryptoMeta[coinId]?.color || "#888888"
                  const change = getAssetChange(coinId)

                  // Get current value from chart data
                  const currentData = chartData[coinId]
                  const currentValue = currentData?.prices?.[currentData.prices.length - 1]?.[1] || 0

                  return (
                    <div
                      key={coinId}
                      className="flex flex-col gap-0.5 px-3 py-2 rounded-lg backdrop-blur-sm"
                      style={{
                        backgroundColor: `${color}15`,
                        border: `1px solid ${color}40`
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-white text-xs font-semibold">{symbol}</span>
                      </div>
                      <div className="text-white text-sm font-bold pl-4">
                        {formatPrice(currentValue)}
                      </div>
                      <div className={`text-xs pl-4 font-medium ${change.positive ? "text-green-400" : "text-red-400"}`}>
                        {change.value}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Powered by label */}
            <div className="absolute bottom-2 right-4 flex items-center gap-2 text-gray-600 text-xs opacity-50">
              <span>Powered by</span>
              <span className="font-semibold">CoinGecko</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
