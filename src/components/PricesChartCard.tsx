import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCoinGecko, type TimeRange } from "@/contexts"
import { formatCompactNumber, formatCurrency } from "@/lib/format"
import { stringToColor } from "@/lib/helpers"
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Search, TrendingUp, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MultiSeriesLightweightChart, type MultiSeriesItem } from "./MultiSeriesLightweightChart"

type FilterCategory = "Top Assets" | "Watchlists" | "Sectors" | "Ecosystems"
type FilterOption = "Top 100" | "Gainers" | "Losers"
type SortField = "rank" | "price" | "change" | "mcap"
type SortOrder = "asc" | "desc"
type ChartTab = "Price" | "Volume" | "Mcap"
type ChartType = "line" | "area" | "bar"

const filterCategories: { category: FilterCategory; icon: React.ReactNode; options?: FilterOption[] }[] = [
  { category: "Top Assets", icon: <TrendingUp className="h-3 w-3" />, options: ["Top 100", "Gainers", "Losers"] },
]

interface PricesChartCardProps {
  onAssetClick?: (assetId: string) => void
}

export function PricesChartCard({ onAssetClick }: PricesChartCardProps) {
  const {
    marketData, isLoadingMarkets, marketError,
    chartData, isLoadingCharts, selectedAssets,
    fetchChartDataForAssets, toggleAsset, timeRange, setTimeRange,
  } = useCoinGecko()

  const navigate = useNavigate()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("Top 100")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeChartTab, setActiveChartTab] = useState<ChartTab>("Price")
  const [chartType, setChartType] = useState<ChartType>("area")
  const [showPercentage, setShowPercentage] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [sortField, setSortField] = useState<SortField>("rank")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100

  const isLoading = isLoadingMarkets
  const error = marketError
  const isChartLoading = isLoadingCharts

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsDropdownOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    fetchChartDataForAssets(selectedAssets, timeRange)
  }, [selectedAssets, timeRange])

  const getTimeRangeLabel = () => {
    const map: Record<string, string> = { "1D": "24h", "7D": "1W", "30D": "1M", "90D": "3M", "1Y": "1Y", "Max": "All" }
    return map[timeRange] ?? "24h"
  }

  const getPriceChangeForTimeRange = (coin: typeof marketData[0]) => {
    switch (timeRange) {
      case "1D": return coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h ?? 0
      case "7D": return coin.price_change_percentage_7d_in_currency ?? 0
      case "30D": return coin.price_change_percentage_30d_in_currency ?? 0
      case "90D": return coin.price_change_percentage_200d_in_currency ?? 0
      case "1Y": case "Max": return coin.price_change_percentage_1y_in_currency ?? 0
      default: return coin.price_change_percentage_7d_in_currency ?? 0
    }
  }

  const filteredData = marketData.filter((coin) => {
    const matchesSearch =
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.name.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false
    const pct = getPriceChangeForTimeRange(coin)
    if (selectedFilter === "Gainers") return pct > 0
    if (selectedFilter === "Losers") return pct < 0
    return true
  })

  const sortedData = [...filteredData].sort((a, b) => {
    let cmp = 0
    switch (sortField) {
      case "rank":  cmp = (a.market_cap_rank || 9999) - (b.market_cap_rank || 9999); break
      case "price": cmp = a.current_price - b.current_price; break
      case "change": cmp = getPriceChangeForTimeRange(a) - getPriceChangeForTimeRange(b); break
      case "mcap":  cmp = a.market_cap - b.market_cap; break
    }
    return sortOrder === "asc" ? cmp : -cmp
  })

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIdx, startIdx + itemsPerPage)

  const getPageLabel = (p: number) =>
    p === 1 ? "Top 100" : `${(p - 1) * 100 + 1}–${Math.min(p * 100, sortedData.length)}`

  useEffect(() => { setCurrentPage(1) }, [selectedFilter, searchQuery, sortField, sortOrder])

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p)
  }

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | string)[] = [1]
    if (currentPage > 3) pages.push("...")
    const s = Math.max(2, currentPage - 1)
    const e = Math.min(totalPages - 1, currentPage + 1)
    for (let i = s; i <= e; i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push("...")
    if (totalPages > 1) pages.push(totalPages)
    return pages
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(o => o === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortOrder(field === "rank" ? "asc" : "desc") }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-2.5 w-2.5 text-gray-600" />
    return sortOrder === "asc"
      ? <ArrowUp className="h-2.5 w-2.5 text-blue-400" />
      : <ArrowDown className="h-2.5 w-2.5 text-blue-400" />
  }

  const buildSeries = (): MultiSeriesItem[] =>
    selectedAssets.flatMap((id) => {
      const d = chartData[id]
      if (!d) return []
      const rawData: [number, number][] =
        activeChartTab === "Price" ? d.prices
        : activeChartTab === "Volume" ? d.total_volumes
        : d.market_caps
      const initVal = rawData[0]?.[1] || 1
      const coin = marketData.find((c) => c.id === id)
      return [{
        id,
        label: coin?.symbol.toUpperCase() || id,
        color: stringToColor(id),
        data: rawData.map(([ts, val]) => ({
          timestamp: ts,
          value: showPercentage ? ((val - initVal) / initVal) * 100 : val,
        })),
      }]
    })

  const chartSeries = buildSeries()


  const getAssetChange = (id: string) => {
    const d = chartData[id]
    if (!d || d.prices.length < 2) return { value: "0%", positive: true }
    const pct = ((d.prices[d.prices.length - 1][1] - d.prices[0][1]) / d.prices[0][1]) * 100
    return { value: `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`, positive: pct >= 0 }
  }

  return (
    <Card className="bg-[#0f1118] border-[#1e2738] gap-2 h-full py-0 flex flex-col">
      {/* Header */}
      <CardHeader className="py-2 px-3.5 gap-0 border-b border-[#1e2738] bg-[#181b28] rounded-t-xl shrink-0">
        <CardTitle className="text-white text-sm font-medium p-0">Prices & Chart</CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-row overflow-hidden">

        {/* ── Left Panel: Table ── */}
        <div className="w-1/3 flex flex-col overflow-hidden border-r border-[#1e2738]">

          {/* Filter bar */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-[#1e2738]">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 px-2 py-1 bg-[#1a2332] rounded border border-[#2a3548] text-[10px] text-white hover:bg-[#232d3f] transition-colors"
              >
                <TrendingUp className="h-3 w-3 text-gray-400" />
                <span>{selectedFilter}</span>
                <ChevronDown className={`h-2.5 w-2.5 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a2332] border border-[#2a3548] rounded-lg shadow-xl z-50 overflow-hidden">
                  {filterCategories.map(cat => (
                    <div key={cat.category}>
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-gray-400">
                        {cat.icon}<span>{cat.category}</span>
                      </div>
                      {cat.options && (
                        <div className="pl-5">
                          {cat.options.map(opt => (
                            <button
                              key={opt}
                              onClick={() => { setSelectedFilter(opt); setIsDropdownOpen(false) }}
                              className={`w-full text-left px-2.5 py-1 text-[10px] hover:bg-[#232d3f] flex items-center gap-1.5 ${selectedFilter === opt ? "text-blue-400" : "text-gray-300"}`}
                            >
                              {selectedFilter === opt ? <span className="text-blue-400">✓</span> : <span className="w-3" />}
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a2332] border border-[#2a3548] rounded pl-6 pr-2 py-1 text-[11px] text-white placeholder-gray-600 focus:outline-none focus:border-[#3a4558]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto min-h-0">
            <table className="w-full text-[11px] border-collapse">
              <thead className="sticky top-0 bg-[#0f1118] z-20 border-b border-[#1e2738]">
                <tr className="text-gray-500">
                  <th className="w-7 px-1.5 py-1.5 text-left font-normal cursor-pointer hover:text-gray-300" onClick={() => handleSort("rank")}>
                    <div className="flex items-center gap-0.5"># {getSortIcon("rank")}</div>
                  </th>
                  <th className="text-left px-1.5 py-1.5 font-normal">Asset</th>
                  <th className="px-1.5 py-1.5 text-right font-normal cursor-pointer hover:text-gray-300" onClick={() => handleSort("price")}>
                    <div className="flex items-center justify-end gap-0.5">Price {getSortIcon("price")}</div>
                  </th>
                  <th className="px-1.5 py-1.5 text-right font-normal cursor-pointer hover:text-gray-300" onClick={() => handleSort("change")}>
                    <div className="flex items-center justify-end gap-0.5">{getTimeRangeLabel()} {getSortIcon("change")}</div>
                  </th>
                  <th className="px-1.5 py-1.5 text-right font-normal cursor-pointer hover:text-gray-300" onClick={() => handleSort("mcap")}>
                    <div className="flex items-center justify-end gap-0.5">Mcap {getSortIcon("mcap")}</div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#1a1f2e]">
                {isLoading && (
                  <tr><td colSpan={5} className="h-24 text-center text-gray-500 text-[11px]">Loading…</td></tr>
                )}
                {error && (
                  <tr><td colSpan={5} className="h-24 text-center text-red-500 text-[11px]">{error}</td></tr>
                )}
                {!isLoading && !error && paginatedData.map(coin => {
                  const sym = coin.symbol.toUpperCase()
                  const color = stringToColor(coin.id)
                  const pct = getPriceChangeForTimeRange(coin)
                  const pos = pct >= 0
                  const sel = selectedAssets.includes(coin.id)

                  return (
                    <tr
                      key={coin.id}
                      onClick={() => toggleAsset(coin.id)}
                      className={`cursor-pointer transition-colors ${sel ? "bg-[#1a2332] border-l-2 border-blue-500" : "hover:bg-[#14181f]"}`}
                    >
                      <td className="px-1.5 py-2 text-gray-500">{coin.market_cap_rank || "–"}</td>

                      <td className="px-1.5 py-2 text-white font-medium">
                        <div className="flex items-center gap-1.5">
                          {coin.image
                            ? <img src={coin.image} alt={sym} className="w-4 h-4 rounded-full object-cover" loading="lazy" />
                            : <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: color }}>{sym[0]}</span>
                          }
                          <button
                            onClick={e => { e.stopPropagation(); navigate(`/coin/${coin.id}`); onAssetClick?.(coin.id) }}
                            className="hover:text-blue-400 hover:underline transition-colors border-none!"
                          >
                            {sym}
                          </button>
                        </div>
                      </td>

                      <td
                        className="px-1.5 py-2 text-white text-right tabular-nums"
                        title={`High: ${formatCurrency(coin.high_24h)}\nLow: ${formatCurrency(coin.low_24h)}`}
                      >
                        {formatCurrency(coin.current_price)}
                      </td>

                      <td className={`px-1.5 py-2 text-right tabular-nums ${pos ? "text-green-400" : "text-red-400"}`}>
                        {pos ? "+" : ""}{pct?.toFixed(2)}%
                      </td>

                      <td className="px-1.5 py-2 text-blue-400 text-right tabular-nums">
                        {formatCompactNumber(coin.market_cap, 2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && !error && sortedData.length > 0 && (
            <div className="px-2.5 py-1.5 border-t border-[#1e2738] flex items-center justify-between shrink-0 bg-[#0f1118]">
              <span className="text-[10px] text-white font-medium px-1.5 py-0.5 bg-[#1a2332] rounded">
                {getPageLabel(currentPage)}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-1 rounded transition-colors ${currentPage === 1 ? "text-gray-700 cursor-not-allowed" : "text-gray-400 hover:bg-[#1a2332] hover:text-white"}`}
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>

                {getPageNumbers().map((p, i) =>
                  typeof p === "number" ? (
                    <button
                      key={i}
                      onClick={() => handlePageChange(p)}
                      className={`min-w-5 h-5 px-1 rounded text-[10px] transition-colors ${currentPage === p ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-[#1a2332] hover:text-white"}`}
                    >
                      {p}
                    </button>
                  ) : (
                    <span key={i} className="text-gray-600 text-[10px] px-0.5">…</span>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-1 rounded transition-colors ${currentPage === totalPages ? "text-gray-700 cursor-not-allowed" : "text-gray-400 hover:bg-[#1a2332] hover:text-white"}`}
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <span className="text-[10px] text-gray-500">{currentPage}/{totalPages}</span>
            </div>
          )}
        </div>

        {/* ── Right Panel: Chart ── */}
        <div className="w-2/3 flex flex-col overflow-hidden">

          {/* Chart Toolbar */}
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[#1e2738] shrink-0 overflow-x-auto no-scrollbar gap-2">
            <div className="flex items-center gap-1">
              {/* Chart type */}
              {([
                { type: "line" as ChartType, icon: <path d="M3 17l5-5 4 4 9-9" /> },
                { type: "area" as ChartType, icon: <><path d="M3 17l5-5 4 4 9-9" /><path d="M3 17h18v4H3z" fill="currentColor" opacity="0.3" /></> },
                { type: "bar" as ChartType, icon: <><rect x="3" y="10" width="4" height="10" /><rect x="10" y="5" width="4" height="15" /><rect x="17" y="8" width="4" height="12" /></> },
              ]).map(({ type, icon }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`p-1 rounded transition-colors ${chartType === type ? "bg-[#2a3548] text-blue-400" : "text-gray-500 hover:bg-[#1a2332] hover:text-white"}`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icon}</svg>
                </button>
              ))}

              <div className="w-px h-3.5 bg-[#2a3548] mx-0.5" />

              {/* Chart data tabs */}
              {(["Price", "Volume", "Mcap"] as ChartTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveChartTab(tab)}
                  className={`px-2 py-0.5 text-[10px] rounded transition-colors ${activeChartTab === tab ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-[#1a2332]"}`}
                >
                  {tab}
                </button>
              ))}

              <div className="w-px h-3.5 bg-[#2a3548] mx-0.5" />

              {/* Time range */}
              {(["1D", "7D", "30D", "90D", "1Y"] as TimeRange[]).map(r => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2 py-0.5 text-[11px] rounded transition-colors ${timeRange === r ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-[#1a2332]"}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setShowPercentage(!showPercentage)}
                className={`px-2 py-0.5 text-[11px] rounded transition-colors ${showPercentage ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-[#1a2332]"}`}
              >
                %
              </button>
            </div>
          </div>

          {/* Selected asset tags */}
          {selectedAssets.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-[#1e2738] shrink-0 flex-wrap">
              {selectedAssets.map(id => {
                const coin = marketData.find(c => c.id === id)
                const sym = coin?.symbol.toUpperCase() || id.toUpperCase()
                const color = stringToColor(id)
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] text-white"
                    style={{ backgroundColor: `${color}25`, borderLeft: `2px solid ${color}` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: color }} />
                    {sym}
                    <button onClick={() => toggleAsset(id)} className="ml-0.5 hover:text-red-400 transition-colors">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )
              })}
            </div>
          )}

          {/* Chart area */}
          <div className="flex-1 min-h-0 relative">
            <MultiSeriesLightweightChart
              series={chartSeries}
              type={chartType === "bar" ? "histogram" : chartType}
              isPercentage={showPercentage}
              currency="USD"
              isLoading={isChartLoading}
            />

            {/* Legend overlay */}
            {selectedAssets.length > 0 && !isChartLoading && (
              <div className="z-20 absolute right-3 top-3 flex flex-col gap-1.5 max-h-[calc(100%-3rem)] overflow-y-auto ointer-events-none">
                {selectedAssets.map(id => {
                  const coin = marketData.find(c => c.id === id)
                  const sym = coin?.symbol.toUpperCase() || id.toUpperCase()
                  const color = stringToColor(id)
                  const change = getAssetChange(id)
                  const cur = chartData[id]?.prices?.at(-1)?.[1] || 0
                  return (
                    <div
                      key={id}
                      className="flex flex-col gap-0.5 px-2.5 py-1.5 rounded-lg backdrop-blur-sm"
                      style={{ backgroundColor: `${color}15`, border: `1px solid ${color}35` }}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-white text-[11px] font-semibold">{sym}</span>
                      </div>
                      <div className="text-white text-xs font-bold pl-3">{formatCurrency(cur)}</div>
                      <div className={`text-[10px] pl-3 font-medium ${change.positive ? "text-green-400" : "text-red-400"}`}>
                        {change.value}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Footer */}
            <div className="absolute bottom-1.5 right-3 text-[10px] text-gray-700 opacity-40 pointer-events-none">
              Powered by CoinGecko
            </div>
            {/* {selectedAssets.length > 0 && !isChartLoading && (
              <div className="absolute bottom-1.5 left-3 text-[10px] text-gray-700 opacity-35 pointer-events-none">
                Scroll to zoom · drag to pan
              </div>
            )} */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
