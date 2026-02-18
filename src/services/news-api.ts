import axios from "axios";
import type {
  NewsItem,
  NewsCategory,
  NewsSource,
  RawNewsResponse,
  NewsQueryParams,
  RawNewsCategory,
  RawSourcesResponse,
  ResearchItem,
} from "@/types/news";

const API_BASE = import.meta.env.VITE_API_BASE;
const BASE_URL = `${API_BASE}/articles/latest`;
const ARTICLES_URL = `${API_BASE}/articles`;
const CATEGORIES_URL = `${API_BASE}/categories`;
const SOURCES_URL = `${API_BASE}/sources`;

// Raw shape as returned by the API (SCREAMING_SNAKE keys).

function mapCategory(raw: any): NewsCategory {
  return {
    id: raw.ID,
    name: raw.NAME,
    type: raw.TYPE,
    category: raw.CATEGORY,
  };
}

function mapRawCategory(raw: RawNewsCategory): RawNewsCategory {
  return {
    id: raw.id,
    name: raw.name,
    categoryId: raw.categoryId,
  };
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
  };
}

export async function fetchLatestNews(): Promise<NewsItem[]> {
  const { data } = await axios.get<RawNewsResponse>(BASE_URL);
  const rawItems = data;

  if (!rawItems || !Array.isArray(rawItems)) {
    return [];
  }

  return rawItems.map(mapNewsItem);
}

/**
 * Fetches news articles from the backend and returns them as typed NewsItem objects.
 */
export async function fetchNews(
  params: NewsQueryParams = {},
): Promise<NewsItem[]> {
  const {
    lang,
    sourceIds,
    categoryIds,
    excludeCategories,
    limit,
    page,
    sentiment,
    fromDate,
    toDate,
    search,
  } = params;

  const { data } = await axios.get(ARTICLES_URL, {
    params: {
      lang,
      sourceIds:
        sourceIds && sourceIds.length > 0 ? sourceIds.join(",") : undefined,
      categoryIds:
        categoryIds && categoryIds.length > 0
          ? categoryIds.join(",")
          : undefined,
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
  });
  const rawItems = data?.data;
  if (!rawItems || !Array.isArray(rawItems)) {
    return [];
  }

  return rawItems.map(mapNewsItem);
}

export async function fetchCategories(): Promise<RawNewsCategory[]> {
  const { data } = await axios.get<{ Data: RawNewsCategory[] }>(CATEGORIES_URL);
  const rawCategories = data;
  if (!rawCategories || !Array.isArray(rawCategories)) return [];
  return rawCategories.map(mapRawCategory);
}

export async function fetchSources(): Promise<NewsSource[]> {
  const { data } = await axios.get<RawSourcesResponse>(SOURCES_URL);
  const raw = data;
  if (!raw || !Array.isArray(raw)) return [];
  return raw.map((s) => ({ id: s.sourceId, name: s.name }));
}

// TODO: Replace with actual research API endpoint
export async function fetchResearchArticles(): Promise<ResearchItem[]> {
  // Dummy endpoint - update this with the actual backend URL
  const RESEARCH_URL = `${API_BASE}/research`;
  
  try {
    const { data } = await axios.get<ResearchItem[]>(RESEARCH_URL);
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return data;
  } catch (error) {
    console.error("Error fetching research articles:", error);
    // Return dummy data for development
    return [
      {
        id: "1",
        title: "Predictive Onchain Intelligence: Gaining Foresight in Crypto Markets of 2026",
        link: "https://medium.com/@aadilzaki48/predictive-onchain-intelligence-gaining-foresight-in-crypto-markets-of-2026-b0c66c7d3d1b",
        content: "Crypto markets in 2026 are unforgiving. Speed has replaced patience, and reaction has given way to anticipation...",
        publishedAt: "Wed, 18 Feb 2026 10:01:15 GMT",
        source: "Cryptocurrency on Medium",
        author: "Aadil Zaki",
        fetchedAt: "2026-02-18T10:13:52.670Z"
      },
      {
        id: "2",
        title: "Crypto Venture Weekly: Feb. 9-13, 2026",
        link: "https://example.com/article2",
        content: "Weekly analysis of venture capital movements in the cryptocurrency space...",
        publishedAt: "Fri, 13 Feb 2026 08:00:00 GMT",
        source: "Crypto Research",
        author: "Alice Hou",
        fetchedAt: "2026-02-18T10:13:52.670Z"
      },
      {
        id: "3",
        title: "Fuse: The Energy Network and TGE",
        link: "https://example.com/article3",
        content: "Deep dive into Fuse network's token generation event and energy infrastructure...",
        publishedAt: "Thu, 12 Feb 2026 14:30:00 GMT",
        source: "Blockchain Insights",
        author: "Matthew Nay",
        fetchedAt: "2026-02-18T10:13:52.670Z"
      },
      {
        id: "4",
        title: "In The Stables: CLARITY Act Hits Wall Over Yield",
        link: "https://example.com/article4",
        content: "Analysis of the CLARITY Act's impact on stablecoin yield regulations...",
        publishedAt: "Wed, 11 Feb 2026 11:00:00 GMT",
        source: "Regulatory Watch",
        author: "Alexander Beaudry",
        fetchedAt: "2026-02-18T10:13:52.670Z"
      },
      {
        id: "5",
        title: "DeFi Protocol Security: Best Practices for 2026",
        link: "https://example.com/article5",
        content: "Comprehensive guide to securing DeFi protocols in the evolving threat landscape...",
        publishedAt: "Tue, 10 Feb 2026 09:15:00 GMT",
        source: "DeFi Security",
        author: "Sarah Chen",
        fetchedAt: "2026-02-18T10:13:52.670Z"
      },
      {
        id: "6",
        title: "Layer 2 Scaling Solutions: Performance Comparison",
        link: "https://example.com/article6",
        content: "Benchmarking the latest Layer 2 solutions for Ethereum and their real-world performance...",
        publishedAt: "Mon, 09 Feb 2026 16:45:00 GMT",
        source: "Scaling Research",
        author: "David Kim",
        fetchedAt: "2026-02-18T10:13:52.670Z"
      }
    ];
  }
}

// TODO: Replace with actual research article detail API endpoint
export async function fetchResearchArticleById(id: string): Promise<ResearchItem | null> {
  // Dummy endpoint - update this with the actual backend URL
  const RESEARCH_DETAIL_URL = `${API_BASE}/research/${id}`;
  
  try {
    const { data } = await axios.get<ResearchItem>(RESEARCH_DETAIL_URL);
    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Error fetching research article ${id}:`, error);
    // Return dummy data for development
    const allArticles = await fetchResearchArticles();
    return allArticles.find(article => article.id === id) || null;
  }
}
