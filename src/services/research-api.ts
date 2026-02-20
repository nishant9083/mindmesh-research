import axios from "axios";
import type { ResearchItem } from "@/types/news";

const API_BASE = import.meta.env.VITE_API_BASE;
const RESEARCH_URL = `${API_BASE}/research`;

/**
 * Fetches all research articles from backend API
 */
export async function fetchResearchArticles(): Promise<ResearchItem[]> {
    try {
        const { data: response } = await axios.get<{ success: boolean; data: ResearchItem[]; pagination: any }>(RESEARCH_URL);
        
        if (!response?.success || !response?.data || !Array.isArray(response.data)) {
            return [];
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching research articles:', error);
        return [];
    }
}

/**
 * Fetches a single research article by ID from backend API
 */
export async function fetchResearchArticleById(id: string): Promise<ResearchItem | null> {
  try {
    const { data: response } = await axios.get<{ success: boolean; data: ResearchItem }>(`${RESEARCH_URL}/${id}`);
    if (!response?.success || !response?.data) {
      return null;
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching research article ${id}:`, error);
    return null;
  }
}

/**
 * Triggers fetching new research articles from RSS feeds
 */
export async function triggerResearchFetch(): Promise<{ message: string; count: number }> {
  try {
    const { data } = await axios.post<{ message: string; count: number }>(`${RESEARCH_URL}/fetch`);
    return data;
  } catch (error) {
    console.error('Error triggering research fetch:', error);
    throw error;
  }
}

/**
 * Regenerates AI summary for a specific research article
 */
export async function regenerateArticleSummary(id: string): Promise<ResearchItem> {
  try {
    const { data } = await axios.post<ResearchItem>(`${RESEARCH_URL}/${id}/regenerate-summary`);
    return data;
  } catch (error) {
    console.error(`Error regenerating summary for article ${id}:`, error);
    throw error;
  }
}
