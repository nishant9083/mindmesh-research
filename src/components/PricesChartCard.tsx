import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, Search, TrendingUp, Eye, Layers, Globe, X, Plus, Maximize2, Download, RotateCcw, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { useCoinGecko, type TimeRange } from "@/contexts"
import { formatCompactNumber, formatCurrency } from "@/lib/format"
import { stringToColor } from "@/lib/helpers"

type FilterCategory = "Top Assets" | "Watchlists" | "Sectors" | "Ecosystems"
type FilterOption = "Top 100" | "Gainers" | "Losers"
type SortField = "rank" | "price" | "change" | "mcap"
type SortOrder = "asc" | "desc"

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

  const navigate = useNavigate()

  // Local UI state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("Top 100")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeChartTab, setActiveChartTab] = useState<ChartTab>("Price")
  const [chartType, setChartType] = useState<ChartType>("area")
  const [showPercentage, setShowPercentage] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("rank")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  // Pagination state - 100 items per page for Top 100, Next 100, etc.
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100

  // Zoom and pan state
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState(0)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState<{ x: number; offset: number } | null>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)

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


  // Get time range label for table header
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "1D": return "24h"
      case "7D": return "1W"
      case "30D": return "1M"
      case "90D": return "3M"
      case "1Y": return "1Y"
      case "Max": return "All"
      default: return "1W"
    }
  }

  // Get appropriate price change percentage based on timeRange
  const getPriceChangeForTimeRange = (coin: typeof marketData[0]) => {
    switch (timeRange) {
      case "1D":
        return coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h ?? 0
      case "7D":
        return coin.price_change_percentage_7d_in_currency ?? 0
      case "30D":
        return coin.price_change_percentage_30d_in_currency ?? 0
      case "90D":
        return coin.price_change_percentage_200d_in_currency ?? 0
      case "1Y":
      case "Max":
        return coin.price_change_percentage_1y_in_currency ?? 0
      default:
        return coin.price_change_percentage_7d_in_currency ?? 0
    }
  }

  // Filter data based on search and selected filter
  const filteredData = marketData.filter((coin) => {
    const matchesSearch = coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    const priceChange = getPriceChangeForTimeRange(coin)
    if (selectedFilter === "Gainers") return priceChange > 0
    if (selectedFilter === "Losers") return priceChange < 0
    return true // Top 100
  })

  // Sort the filtered data
  const sortedData = [...filteredData].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case "rank":
        comparison = (a.market_cap_rank || 9999) - (b.market_cap_rank || 9999)
        break
      case "price":
        comparison = a.current_price - b.current_price
        break
      case "change":
        comparison = getPriceChangeForTimeRange(a) - getPriceChangeForTimeRange(b)
        break
      case "mcap":
        comparison = a.market_cap - b.market_cap
        break
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = sortedData.slice(startIndex, endIndex)
  console.log("Paginated data length:", paginatedData)

  // Get page label (Top 100, Next 100, etc.)
  const getPageLabel = (pageNum: number) => {
    if (pageNum === 1) return "Top 100"
    return `${(pageNum - 1) * 100 + 1}-${Math.min(pageNum * 100, sortedData.length)}`
  }

  // Reset to page 1 when filter, search, or sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedFilter, searchQuery, sortField, sortOrder])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Always show first page
    pages.push(1)

    if (currentPage > 3) {
      pages.push("...")
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push("...")
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

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

  // Handle column sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle order if clicking same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // Set new field with default order
      setSortField(field)
      setSortOrder(field === "rank" ? "asc" : "desc") // Rank defaults to asc, others to desc
    }
  }

  // Get sort icon component
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-gray-600" />
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 text-blue-400" />
    ) : (
      <ArrowDown className="h-3 w-3 text-blue-400" />
    )
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

  // Zoom and pan handlers
  const resetZoom = () => {
    setZoomLevel(1)
    setPanOffset(0)
  }

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoomLevel((prev) => Math.max(1, Math.min(10, prev * delta)))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true)
    setPanStart({ x: e.clientX, offset: panOffset })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && panStart) {
      const deltaX = e.clientX - panStart.x
      const panSpeed = 0.5
      const maxPan = preparedChartData.length * (zoomLevel - 1) / 2
      const newOffset = Math.max(-maxPan, Math.min(maxPan, panStart.offset - deltaX * panSpeed))
      setPanOffset(newOffset)
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
    setPanStart(null)
  }

  // Calculate visible data range based on zoom and pan
  const getVisibleDataRange = () => {
    const dataLength = preparedChartData.length
    if (zoomLevel === 1) return { start: 0, end: dataLength }

    const visibleCount = Math.floor(dataLength / zoomLevel)
    const center = dataLength / 2 + panOffset
    const start = Math.max(0, Math.floor(center - visibleCount / 2))
    const end = Math.min(dataLength, Math.ceil(center + visibleCount / 2))

    return { start, end }
  }

  const { start, end } = getVisibleDataRange()
  const displayData = preparedChartData.slice(start, end)

  // Add wheel event listener
  useEffect(() => {
    const container = chartContainerRef.current
    if (!container) return

    const wheelHandler = (e: WheelEvent) => handleWheel(e)
    container.addEventListener('wheel', wheelHandler, { passive: false })

    return () => container.removeEventListener('wheel', wheelHandler)
  }, [zoomLevel])

  // Reset zoom when time range changes
  useEffect(() => {
    resetZoom()
  }, [timeRange, selectedAssets])

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

                  <th
                    className="w-8 px-2 py-2 text-left font-normal cursor-pointer hover:text-gray-300 transition-colors group"
                    onClick={() => handleSort("rank")}
                  >
                    <div className="flex items-center gap-1">
                      <span>#</span>
                      {getSortIcon("rank")}
                    </div>
                  </th>

                  <th className="w-17.5 text-left px-2 py-2 font-normal">
                    Asset
                  </th>

                  <th
                    className="w-17.5 px-2 py-2 text-right font-normal cursor-pointer hover:text-gray-300 transition-colors group"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Price</span>
                      {getSortIcon("price")}
                    </div>
                  </th>

                  <th
                    className="w-15 px-2 py-2 text-right font-normal cursor-pointer hover:text-gray-300 transition-colors group"
                    onClick={() => handleSort("change")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>{getTimeRangeLabel()}</span>
                      {getSortIcon("change")}
                    </div>
                  </th>

                  <th
                    className="w-17.5 px-2 py-2 text-right font-normal cursor-pointer hover:text-gray-300 transition-colors group"
                    onClick={() => handleSort("mcap")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Mcap</span>
                      {getSortIcon("mcap")}
                    </div>
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
                {!isLoading && !error && paginatedData.map((coin) => {
                  console.log("Rendering row for:", coin, paginatedData[0])

                  const symbol = coin.symbol.toUpperCase()

                  const color = stringToColor(coin.id)

                  const changePercent = getPriceChangeForTimeRange(coin)

                  const positive = changePercent >= 0

                  const selected =
                    selectedAssets.includes(coin.id)


                  return (
                    <tr
                      key={coin.id}
                      className={`
                cursor-pointer transition-colors
                ${selected
                          ? "bg-[#1a2332] border-l-2 border-blue-500"
                          : "hover:bg-[#1a2332]"
                        }
              `}
                    >

                      {/* Rank */}
                      <td
                        className="px-2 py-2.5 text-gray-500"
                        onClick={() => toggleAssetSelection(coin.id)}
                      >
                        {coin.market_cap_rank || "-"}
                      </td>


                      {/* Asset - Make clickable to navigate to detail page */}
                      <td
                        className="px-2 py-2.5 text-white font-medium group"
                        onClick={() => toggleAssetSelection(coin.id)}
                        title="Click to view details"
                      >
                        <div className="flex items-center gap-2 group-hover:text-blue-400 transition-colors">

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
                              navigate(`/coin/${coin.id}`)
                              onAssetClick?.(coin.id)
                            }}
                            className="hover:text-blue-400 hover:underline transition-colors border-none!"
                          >
                            {symbol}
                          </button>
                        </div>
                      </td>


                      {/* Price */}
                      <td
                        className="px-2 py-2.5 text-white text-right group relative cursor-pointer"
                        onClick={() => toggleAssetSelection(coin.id)}
                        title={`24h High: ${formatCurrency(coin.high_24h)}\n24h Low: ${formatCurrency(coin.low_24h)}\nATH: ${formatCurrency(coin.ath)}\nATL: ${formatCurrency(coin.atl)}`}
                      >
                        {formatCurrency(coin.current_price)}
                      </td>


                      {/* Price Change % */}
                      <td
                        className={`px-2 py-2.5 text-right ${positive
                          ? "text-green-400"
                          : "text-red-400"
                          }`}
                        onClick={() => toggleAssetSelection(coin.id)}
                        title={`${getTimeRangeLabel()} Change: ${positive ? "+" : ""}${changePercent?.toFixed(2)}%\n24h Change: ${coin.price_change_percentage_24h >= 0 ? "+" : ""}${coin.price_change_percentage_24h?.toFixed(2)}%`}
                      >
                        {positive ? "+" : ""}
                        {changePercent?.toFixed(2)}%
                      </td>


                      {/* Market Cap */}
                      <td
                        className="px-2 py-2.5 text-blue-400 text-right"
                        onClick={() => toggleAssetSelection(coin.id)}
                        title={`Market Cap: ${formatCompactNumber(coin.market_cap, 2)}\n24h Volume: ${formatCompactNumber(coin.total_volume, 2)}\nCirculating: ${coin.circulating_supply.toLocaleString()} ${symbol}\n${coin.max_supply ? `Max Supply: ${coin.max_supply.toLocaleString()} ${symbol}` : 'No Max Supply'}`}
                      >
                        {formatCompactNumber(coin.market_cap, 2)}
                      </td>

                    </tr>
                  )
                })}
              </tbody>

            </table>

          </div>

          {/* Pagination Controls */}
          {!isLoading && !error && sortedData.length > 0 && (
            <div className="px-3 py-2 border-t border-[#1e2738] flex items-center justify-between shrink-0 bg-[#0f1118]">
              {/* <div className="text-xs text-gray-400">
                Showing {startIndex + 1}-{Math.min(endIndex, sortedData.length)} of {sortedData.length}
              </div> */}

              <div className="flex items-center gap-2">
                {/* Current Page Label */}
                <span className="text-xs text-white font-medium px-2 py-1 bg-[#1a2332] rounded">
                  {getPageLabel(currentPage)}
                </span>

                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-1.5 rounded transition-colors ${currentPage === 1
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 hover:bg-[#1a2332] hover:text-white"
                    }`}
                  title="Previous 100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, idx) => (
                  typeof page === "number" ? (
                    <button
                      key={idx}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-7 h-7 px-2 rounded text-xs transition-colors ${currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-400 hover:bg-[#1a2332] hover:text-white"
                        }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={idx} className="px-2 text-gray-600 text-xs">
                      {page}
                    </span>
                  )
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-1.5 rounded transition-colors ${currentPage === totalPages
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 hover:bg-[#1a2332] hover:text-white"
                    }`}
                  title="Next 100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="text-xs text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
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

              <div className="w-px h-4 bg-[#2a3548] mx-1" />

              {/* Zoom controls */}
              <button
                onClick={resetZoom}
                disabled={zoomLevel === 1}
                className={`p-1.5 rounded transition-colors ${zoomLevel > 1
                  ? "text-blue-400 hover:bg-[#1a2332] hover:text-blue-300"
                  : "text-gray-600 cursor-not-allowed"
                  }`}
                title={`Reset zoom${zoomLevel > 1 ? ` (${zoomLevel.toFixed(1)}x)` : ""}`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

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
              const coin = marketData.find(c => c.id === coinId)
              const symbol = coin?.symbol.toUpperCase() || coinId.toUpperCase()
              const color = stringToColor(coinId)

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
              <div
                ref={chartContainerRef}
                className={`w-full h-full ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <ResponsiveContainer width="100%" height="100%">{chartType === "line" ? (
                  <LineChart
                    data={displayData}
                    margin={{ top: 20, right: 80, left: 10, bottom: 20 }}
                  >
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
                              const coin = marketData.find(c => c.id === coinId)
                              const symbol = coin?.symbol.toUpperCase() || coinId.toUpperCase()
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
                                      : formatCurrency(value)
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
                        stroke={stringToColor(coinId)}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5, strokeWidth: 2 }}
                        animationDuration={800}
                      />
                    ))}
                  </LineChart>
                ) : chartType === "area" ? (
                  <AreaChart
                    data={displayData}
                    margin={{ top: 20, right: 80, left: 10, bottom: 20 }}
                  >
                    <defs>
                      {selectedAssets.map((coinId) => {
                        const color = stringToColor(coinId)
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
                              const coin = marketData.find(c => c.id === coinId)
                              const symbol = coin?.symbol.toUpperCase() || coinId.toUpperCase()
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
                                      : formatCurrency(value)
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
                        stroke={stringToColor(coinId)}
                        strokeWidth={2.5}
                        fill={`url(#gradient-${coinId})`}
                        dot={false}
                        activeDot={{ r: 5, strokeWidth: 2 }}
                        animationDuration={800}
                      />
                    ))}
                  </AreaChart>
                ) : (
                  <BarChart
                    data={displayData}
                    margin={{ top: 20, right: 80, left: 10, bottom: 20 }}
                  >
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
                              const coin = marketData.find(c => c.id === coinId)
                              const symbol = coin?.symbol.toUpperCase() || coinId.toUpperCase()
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
                                      : formatCurrency(value)
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
                        fill={stringToColor(coinId)}
                        opacity={0.8}
                        animationDuration={800}
                        radius={[4, 4, 0, 0]}
                      />
                    ))}
                  </BarChart>
                )}
                </ResponsiveContainer>
              </div>
            )}

            {/* Chart Statistics/Legend */}
            {selectedAssets.length > 0 && !isChartLoading && (
              <div className="absolute right-4 top-4 flex flex-col gap-2">
                {selectedAssets.map((coinId) => {
                  const coin = marketData.find(c => c.id === coinId)
                  const symbol = coin?.symbol.toUpperCase() || coinId.toUpperCase()
                  const color = stringToColor(coinId)
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
                        {formatCurrency(currentValue)}
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

            {/* Zoom hint */}
            {zoomLevel === 1 && selectedAssets.length > 0 && !isChartLoading && (
              <div className="absolute bottom-2 left-4 text-gray-600 text-xs opacity-40 flex items-center gap-1">
                <span>💡 Scroll to zoom, drag to pan</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
