import axios from "axios"
import type { NewsItem, NewsCategory, NewsSource, RawNewsResponse, NewsQueryParams, RawNewsCategory, RawSourcesResponse } from "@/types/news"

const API_BASE = import.meta.env.VITE_API_BASE
const BASE_URL = `${API_BASE}/articles/latest`
const ARTICLES_URL = `${API_BASE}/articles`
const CATEGORIES_URL = `${API_BASE}/categories`
const SOURCES_URL = `${API_BASE}/sources`

// Raw shape as returned by the API (SCREAMING_SNAKE keys).

function mapCategory(raw: any): NewsCategory {
  return {
    id: raw.ID,
    name: raw.NAME,
    type: raw.TYPE,
    category: raw.CATEGORY,
  }
}

function mapRawCategory(raw: RawNewsCategory): RawNewsCategory {
  return {
    id: raw.id,
    name: raw.name,
    categoryId: raw.categoryId,
  }
}

function mapNewsItem(raw: NewsItem): NewsItem {
  return {
    type: raw.type,
    id: raw.id,
    guid: raw.guid,
    publishedOn: raw.publishedOn,
    imageUrl: raw.imageUrl,
    title: raw.title,
    subtitle: raw.subtitle,
    authors: raw.authors,
    url: raw.url,
    sourceId: raw.sourceId,
    body: raw.body,
    lang: raw.lang,
    upvotes: raw.upvotes,
    downvotes: raw.downvotes,
    score: raw.score,
    sentiment: raw.sentiment,
    status: raw.status,
    createdOn: raw.createdOn,
    sourceData: raw.sourceData,
    updatedOn: raw.updatedOn,
    categoryData: (raw.categoryData ?? []).map(mapCategory),
  }
}

export async function fetchLatestNews(): Promise<NewsItem[]> {
  const { data } = await axios.get<RawNewsResponse>(BASE_URL)
// console.log(data)
  const rawItems = data
  if (!rawItems || !Array.isArray(rawItems)) {
    return []
  }

  return rawItems.map(mapNewsItem)
}

/**
 * Fetches news articles from the backend and returns them as typed NewsItem objects.
 */
export async function fetchNews(params: NewsQueryParams = {}): Promise<NewsItem[]> {
  const { lang, sourceIds, categoryIds, excludeCategories, limit, page, sentiment, fromDate, toDate, search } = params

  const { data } = await axios.get(ARTICLES_URL, {
    params: {
      lang,
      sourceIds: sourceIds && sourceIds.length > 0 ? sourceIds.join(",") : undefined,
      categoryIds: categoryIds && categoryIds.length > 0 ? categoryIds.join(",") : undefined,
      excludeCategories:
        excludeCategories && excludeCategories.length > 0
          ? excludeCategories.join(",")
          : undefined,
      limit,
      page,
      sentiment,
      fromDate,
      toDate,
      search,
    },
  })
  const rawItems = data?.data
  if (!rawItems || !Array.isArray(rawItems)) {
    return []
  }

  return rawItems.map(mapNewsItem)
}

export async function fetchCategories(): Promise<RawNewsCategory[]> {
  const { data } = await axios.get<{ Data: RawNewsCategory[] }>(CATEGORIES_URL)
  const rawCategories = data
  if (!rawCategories || !Array.isArray(rawCategories)) return []
  return rawCategories.map(mapRawCategory)
}

export async function fetchSources(): Promise<NewsSource[]> {
  const { data } = await axios.get<RawSourcesResponse>(SOURCES_URL)
  const raw = data
  if (!raw || !Array.isArray(raw)) return []
  return raw.map((s) => ({ id: s.sourceId, name: s.name }))
}
