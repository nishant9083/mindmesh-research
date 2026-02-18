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

/**
 * Extracts image URL from Medium RSS description HTML
 */
function extractImageUrl(description: string): string | undefined {
  try {
    const imgMatch = description.match(/<img[^>]+src="([^"]+)"/i);
    return imgMatch ? imgMatch[1] : undefined;
  } catch (error) {
    return undefined;
  }
}

/**
 * Extracts text content from Medium RSS description HTML
 */
function extractContentSnippet(description: string): string {
  try {
    // Extract content from <p class="medium-feed-snippet">
    const snippetMatch = description.match(/<p class="medium-feed-snippet">([^<]+)<\/p>/i);
    if (snippetMatch) {
      // Decode HTML entities
      const text = snippetMatch[1]
        .replace(/&#x([0-9A-F]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
      return text.trim();
    }
    
    // Fallback: strip all HTML tags
    const stripped = description.replace(/<[^>]+>/g, ' ').trim();
    return stripped.substring(0, 200) + (stripped.length > 200 ? '...' : '');
  } catch (error) {
    return '';
  }
}

/**
 * Fetches research articles from local Medium RSS XML file
 */
export async function fetchResearchArticles(): Promise<ResearchItem[]> {
  try {
    // Fetch local XML file from public folder
    const { data } = await axios.get('/medium-feed.xml', {
      responseType: 'text',
    });
    
    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'text/xml');
    
    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.error('XML parsing error:', parseError.textContent);
      return [];
    }
    
    // Get channel title (source)
    const channelTitle = xmlDoc.querySelector('channel > title')?.textContent || 'Cryptocurrency on Medium';
    
    // Get all items
    const items = xmlDoc.querySelectorAll('item');
    const fetchedAt = new Date().toISOString();
    
    const articles: ResearchItem[] = Array.from(items).map((item, index) => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const creator = item.querySelector('creator')?.textContent || 'Unknown';
      const guid = item.querySelector('guid')?.textContent || '';
      
      // Extract image URL and content snippet from description
      const imageUrl = extractImageUrl(description);
      const content = extractContentSnippet(description);
      
      // Generate ID from guid or link
      const id = guid ? guid.split('/').pop() || `${index + 1}` : `${index + 1}`;
      
      return {
        id,
        title,
        link,
        content,
        publishedAt: pubDate,
        source: channelTitle,
        author: creator,
        imageUrl,
        fetchedAt,
      };
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching research articles from XML file:', error);
    return [];
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
