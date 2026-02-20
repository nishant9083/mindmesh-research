import axios from "axios";
import type { DailyRecap } from "@/types/news";

const API_BASE = import.meta.env.VITE_API_BASE;
const DAILY_RECAP_URL = `${API_BASE}/news/recaps`;

/**
 * Fetches all daily recaps from backend API
 * @param limit - Maximum number of recaps to fetch (default: 7 for a week)
 */
export async function fetchDailyRecaps(limit: number = 7): Promise<DailyRecap[]> {
  try {
    const { data: response } = await axios.get<{ data: DailyRecap[] }>(DAILY_RECAP_URL, {
      params: { limit },
    });
    console.log(response.data);

    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching daily recaps:', error);
    return [];
  }
}

/**
 * Fetches a single daily recap by ID
 * @param id - The daily recap ID
 */
export async function fetchLatestDailyRecap(): Promise<DailyRecap | null> {
  try {
    const { data } = await axios.get<DailyRecap>(`${DAILY_RECAP_URL}/latest`);
    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Error fetching daily recap`, error);
    return null;
  }
}

export function truncateToWords(text: string, wordCount: number = 12): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) {
    return text;
  }
  return words.slice(0, wordCount).join(' ') + '...';
}
