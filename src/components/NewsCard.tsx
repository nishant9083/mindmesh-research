import { useCallback, useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, ExternalLink } from "lucide-react"

import type { NewsItem, NewsSource, RawNewsCategory, NewsQueryParams } from "@/types/news"
import { fetchLatestNews, fetchNews, fetchCategories, fetchSources } from "@/services/news-api"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface NewsCardProps {
    onNewsClick?: (news: NewsItem) => void
}

interface FilterState {
    search: string
    sourceIds: number[]
    categories: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function NewsCard({ onNewsClick }: NewsCardProps) {
    // Data state
    const [newsData, setNewsData] = useState<NewsItem[]>([])
    const [allCategories, setAllCategories] = useState<RawNewsCategory[]>([])
    const [allSources, setAllSources] = useState<NewsSource[]>([])

    // Loading states
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [isFiltering, setIsFiltering] = useState(false)

    // Filter state (for user input, not yet applied)
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        sourceIds: [],
        categories: [],
    })

    // ───────────────────────────────────────────────────────────────────────────
    // Initial data load
    // ───────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        let cancelled = false

        async function loadInitialData() {
            try {
                setIsInitialLoading(true)

                const [categoriesRes, sourcesRes, newsRes] = await Promise.all([
                    fetchCategories(),
                    fetchSources(),
                    fetchLatestNews(),
                ])

                if (cancelled) return

                setAllCategories(categoriesRes)
                setAllSources(sourcesRes)
                setNewsData(newsRes)
            } catch (error) {
                console.error("Failed to load initial data:", error)
            } finally {
                if (!cancelled) {
                    setIsInitialLoading(false)
                }
            }
        }

        loadInitialData()

        return () => {
            cancelled = true
        }
    }, [])

    // ───────────────────────────────────────────────────────────────────────────
    // Filter handlers
    // ───────────────────────────────────────────────────────────────────────────

    const handleSearchChange = (value: string) => {
        setFilters((prev) => ({ ...prev, search: value }))
    }

    const handleSearch = async () => {
        try {
            const params: NewsQueryParams = {
                search: filters.search.trim() || undefined,
                limit: 50,
            }

            let items = await fetchNews(params);
            setNewsData(items);
        } catch (error) {
            console.error("Failed to fetch news with filters:", error)
        }
    }

    const handleSourceToggle = (sourceId: number) => {
        setFilters((prev) => ({
            ...prev,
            sourceIds: prev.sourceIds.includes(sourceId)
                ? prev.sourceIds.filter((id) => id !== sourceId)
                : [...prev.sourceIds, sourceId],
        }))
    }

    const handleCategoryToggle = (category: string) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter((c) => c !== category)
                : [...prev.categories, category],
        }))
    }

    const clearFilters = useCallback(async() => {
        setFilters({ search: "", sourceIds: [], categories: [] })

        try {
            setIsFiltering(true)

            let items = await fetchLatestNews()
            setNewsData(items)
        } catch (error) {
            console.error("Failed to fetch news with filters:", error)
        } finally {
            setIsFiltering(false)
        }
    },[])

    const applyFilters = useCallback(async () => {
        const hasFilters =
            filters.search.trim() !== "" ||
            filters.sourceIds.length > 0 ||
            filters.categories.length > 0

        try {
            setIsFiltering(true)

            let items: NewsItem[]

            if (hasFilters) {
                const params: NewsQueryParams = {
                    sourceIds: filters.sourceIds.length > 0 ? filters.sourceIds : undefined,
                    categoryIds: filters.categories.length > 0 ? filters.categories : undefined,
                    limit: 50,
                }
                // console.log(filters);
                items = await fetchNews(params)
            } else {
                items = await fetchLatestNews()
            }

            setNewsData(items)
        } catch (error) {
            console.error("Failed to fetch news with filters:", error)
        } finally {
            setIsFiltering(false)
        }
    }, [filters])

    // ───────────────────────────────────────────────────────────────────────────
    // Derived state
    // ───────────────────────────────────────────────────────────────────────────

    const hasActiveFilters =
        // filters.search.trim() !== "" ||
        filters.sourceIds.length > 0 ||
        filters.categories.length > 0

    // ───────────────────────────────────────────────────────────────────────────
    // Render
    // ───────────────────────────────────────────────────────────────────────────

    return (
        <Card className="bg-[#0d1421] border-[#1e2738] h-full flex flex-col py-0">
            {/* Header */}
            <CardHeader className="pb-3 pt-4 px-4 border-b border-[#1e2738]">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-white text-base font-medium">News</CardTitle>
                    <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
                {/* Filters Section */}
                <div className="px-4 pt-0 pb-4 space-y-2 border-b border-[#1e2738]">
                    {/* Search Input */}
                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-500">
                            <Search className="h-4 w-4" />
                        </span>
                        <input
                            type="text"
                            value={filters.search}
                            onKeyDown={(event) => {
                                if (event.key == "Enter") {
                                    handleSearch();
                                }
                            }}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Search news..."
                            className="w-full bg-[#050816] border border-[#1e2738] rounded-md pl-8 pr-2 py-1.5 text-xs text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500/60"
                        />
                    </div>

                    {/* Multi-select dropdowns row */}
                    <div className="flex gap-2">
                        <MultiSelectDropdown
                            label="Sources"
                            options={allSources.map((s) => ({ id: s.id, label: s.name }))}
                            selectedIds={filters.sourceIds}
                            onToggle={handleSourceToggle}
                        />
                        <MultiSelectDropdown
                            label="Categories"
                            options={allCategories.map((c) => ({ id: c.categoryId, label: c.name }))}
                            selectedIds={filters.categories}
                            onToggle={handleCategoryToggle}
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={applyFilters}
                            disabled={isFiltering}
                            className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800 disabled:cursor-not-allowed text-white text-xs font-medium py-1.5 px-3 rounded-md transition-colors"
                        >
                            {isFiltering ? "Applying..." : "Apply Filters"}
                        </button>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-gray-400 hover:text-gray-200 text-xs py-1.5 px-2 rounded-md border border-[#1e2738] hover:border-gray-500 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* News List */}
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        {isInitialLoading ? (
                            <LoadingState />
                        ) : newsData.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="space-y-0">
                                {newsData.map((news) => (
                                    <NewsItemRow
                                        key={news.id}
                                        news={news}
                                        onClick={onNewsClick ? () => onNewsClick(news) : undefined}
                                    />
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface MultiSelectDropdownProps<T extends string | number> {
    label: string
    options: { id: T; label: string }[]
    selectedIds: T[]
    onToggle: (id: T) => void
}

function MultiSelectDropdown<T extends string | number>({
    label,
    options,
    selectedIds,
    onToggle,
}: MultiSelectDropdownProps<T>) {
    const [isOpen, setIsOpen] = useState(false)

    const selectedCount = selectedIds.length
    const displayText = selectedCount > 0 ? `${label} (${selectedCount})` : `All ${label.toLowerCase()}`

    return (
        <div className="relative flex-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[#050816] border border-[#1e2738] rounded-md px-2 py-1.5 text-xs text-gray-200 text-left focus:outline-none focus:ring-1 focus:ring-violet-500/60 flex items-center justify-between"
            >
                <span className="truncate">{displayText}</span>
                <span className="text-gray-500 ml-1">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop to close dropdown */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

                    {/* Dropdown menu */}
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#0d1421] border border-[#1e2738] rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {options.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-gray-500">No options</div>
                        ) : (
                            options.map((option) => {
                                const isSelected = selectedIds.includes(option.id)
                                return (
                                    <button
                                        key={String(option.id)}
                                        onClick={() => onToggle(option.id)}
                                        title={option.label}
                                        className={`w-full text-left px-3 py-2 text-xs hover:bg-[#1a2332] transition-colors flex items-center gap-2 ${isSelected ? "text-violet-300 bg-violet-900/20" : "text-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`w-3 h-3 rounded border shrink-0 flex items-center justify-center ${isSelected ? "bg-violet-600 border-violet-600" : "border-gray-500"
                                                }`}
                                        >
                                            {isSelected && <span className="text-white text-[8px]">✓</span>}
                                        </span>
                                        <span className="truncate">{option.label}</span>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

function NewsItemRow({ news, onClick }: { news: NewsItem; onClick?: () => void }) {
    const primaryCategory = news.categoryData?.[0]?.category
    const sentiment = news.sentiment

    return (
        <div
            className="px-4 py-3 hover:bg-[#1a2332] cursor-pointer border-b border-[#1e2738] last:border-b-0 group"
            onClick={onClick}
        >
            <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm text-gray-200 leading-snug group-hover:text-white transition-colors line-clamp-2">
                        {news.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-xs text-gray-500">{formatTimeAgo(news.publishedOn)}</span>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-xs text-gray-400">{news.sourceData.NAME}</span>
                        {primaryCategory && (
                            <>
                                <span className="text-xs text-gray-500">·</span>
                                <span className="text-xs text-violet-300">{primaryCategory}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        {news.authors && (
                            <span className="text-xs text-gray-500 truncate max-w-35">
                                {news.authors}
                            </span>
                        )}
                        {sentiment && (
                            <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wide ${getSentimentClasses(
                                    sentiment
                                )}`}
                            >
                                {sentiment}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="px-4 py-8 flex items-center justify-center">
            <div className="text-xs text-gray-500">Loading news...</div>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="px-4 py-8 flex flex-col items-center justify-center gap-2">
            <div className="text-xs text-gray-500">No news found.</div>
            <div className="text-xs text-gray-600">Try adjusting your filters.</div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function formatTimeAgo(unixSeconds: number): string {
    const now = Date.now()
    const date = unixSeconds * 1000
    const diffMs = Math.max(0, now - date)
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 1) return "Now"
    if (diffHours < 24) return `${diffHours}h`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d`
}

function getSentimentClasses(sentiment: string): string {
    const upper = sentiment.toUpperCase()
    if (upper === "POSITIVE") return "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40"
    if (upper === "NEGATIVE") return "bg-red-900/60 text-red-300 border border-red-500/40"
    if (upper === "NEUTRAL") return "bg-slate-800 text-slate-200 border border-slate-500/40"
    return "bg-slate-800 text-slate-200 border border-slate-500/40"
}
