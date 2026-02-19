export interface NewsCategory {
  id: number
  name: string
  type:string
  category: string
}

export interface NewsSource {
  id: number
  name: string
}

// Represents a single news article entry from the feed
export interface NewsItem {
  type: string
  id: number
  guid: string
  publishedOn: number
  imageUrl: string | null
  title: string
  subtitle: string | null
  authors: string
  url: string
  sourceId: number
  body: string
  lang: string
  upvotes: number
  downvotes: number
  score: number
  sentiment: string
  status: string
  createdOn: number
  updatedOn: number | null
  sourceData: {
    NAME: string
  }
  categoryData: NewsCategory[]
}

export interface RawNewsCategory {
  id: number
  name: string
  categoryId: string
}

export interface RawNewsResponse {
  Data: NewsItem[]
  Err: Record<string, unknown>
}

export interface ResearchItem {
  id: string
  title: string
  description?: string
  url: string
  source: string
  author?: string
  publishedAt?: string
  content?: string
  aiSummary?: string
  imageUrl?: string
  tags?: string
  isSummarized: boolean
  createdAt: string
  updatedAt: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Daily Recap Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Source reference for a daily recap bullet point
 */
export interface DailyRecapSource {
  id: string
  title: string
  url: string
  sourceName: string
}

/**
 * A single bullet point in the daily recap
 */
export interface DailyRecapBullet {
  text: string
  sources: DailyRecapSource[]
}

/**
 * Daily Recap item - AI-generated summary of the day's news
 */
export interface DailyRecap {
  id: string
  date: string                    // ISO date string (e.g., "2026-02-19")
  displayDate: string             // Formatted display date (e.g., "Today, Feb 19")
  aiSummary: string               // Full AI-generated summary text
  bullets: DailyRecapBullet[]     // Structured bullet points with sources
  updatedAt: string               // Last updated timestamp
  createdAt: string               // Creation timestamp
}

export interface RawSource {
  id: number
  name: string
}

export interface RawSourcesResponse {
  Data: RawSource[]
}

export interface NewsQueryParams {
  lang?: string
  sourceIds?: number[]
  categoryIds?: string[]
  excludeCategories?: string[]
  limit?: number
  page?: number
  sentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | string
  fromDate?: string
  toDate?: string
  search?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Component Props
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Props for the NewsCard component
 */
export interface NewsCardProps {
  onNewsClick?: (news: NewsItem) => void
}

/**
 * Filter state for news filtering
 */
export interface FilterState {
  search: string
  sourceIds: number[]
  categories: string[]
}

/**
 * Props for MultiSelectDropdown component
 */
export interface MultiSelectDropdownProps<T extends string | number> {
  label: string
  options: { id: T; label: string }[]
  selectedIds: T[]
  onToggle: (id: T) => void
}