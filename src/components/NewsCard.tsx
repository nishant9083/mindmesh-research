import { useCallback, useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, ExternalLink } from "lucide-react"

import type { NewsItem, NewsSource, RawNewsCategory, NewsQueryParams, NewsCardProps, FilterState } from "@/types/news"
import { fetchLatestNews, fetchNews, fetchCategories, fetchSources } from "@/services/news-api"
import { MultiSelectDropdown } from "./MultiSelectDropdown"
import { NewsItemRow } from "./NewsItemRow"
import { LoadingState, EmptyState } from "./StateIndicators"

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

      const items = await fetchNews(params)
      setNewsData(items)
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

  const clearFilters = useCallback(async () => {
    setFilters({ search: "", sourceIds: [], categories: [] })

    try {
      setIsFiltering(true)

      const items = await fetchLatestNews()
      setNewsData(items)
    } catch (error) {
      console.error("Failed to fetch news with filters:", error)
    } finally {
      setIsFiltering(false)
    }
  }, [])

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

  const hasActiveFilters = filters.sourceIds.length > 0 || filters.categories.length > 0

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
                if (event.key === "Enter") {
                  handleSearch()
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
