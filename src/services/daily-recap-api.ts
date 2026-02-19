import axios from "axios";
import type { DailyRecap } from "@/types/news";

const API_BASE = import.meta.env.VITE_API_BASE;
const DAILY_RECAP_URL = `${API_BASE}/daily-recap`;

/**
 * Fetches all daily recaps from backend API
 * @param limit - Maximum number of recaps to fetch (default: 7 for a week)
 */
export async function fetchDailyRecaps(limit: number = 7): Promise<DailyRecap[]> {
  try {
    const { data } = await axios.get<DailyRecap[]>(DAILY_RECAP_URL, {
      params: { limit },
    });
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching daily recaps:', error);
    return [];
  }
}

/**
 * Fetches a single daily recap by ID
 * @param id - The daily recap ID
 */
export async function fetchDailyRecapById(id: string): Promise<DailyRecap | null> {
  try {
    const { data } = await axios.get<DailyRecap>(`${DAILY_RECAP_URL}/${id}`);
    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Error fetching daily recap ${id}:`, error);
    return null;
  }
}

/**
 * Fetches the daily recap for a specific date
 * @param date - ISO date string (e.g., "2026-02-19")
 */
export async function fetchDailyRecapByDate(date: string): Promise<DailyRecap | null> {
  try {
    const { data } = await axios.get<DailyRecap>(`${DAILY_RECAP_URL}/date/${date}`);
    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Error fetching daily recap for date ${date}:`, error);
    return null;
  }
}

/**
 * Fetches today's daily recap
 */
export async function fetchTodayRecap(): Promise<DailyRecap | null> {
  try {
    const { data } = await axios.get<DailyRecap>(`${DAILY_RECAP_URL}/today`);
    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error fetching today\'s daily recap:', error);
    return null;
  }
}

/**
 * Triggers generation of a new daily recap for today
 */
export async function generateDailyRecap(): Promise<DailyRecap> {
  try {
    const { data } = await axios.post<DailyRecap>(`${DAILY_RECAP_URL}/generate`);
    return data;
  } catch (error) {
    console.error('Error generating daily recap:', error);
    throw error;
  }
}

/**
 * Truncates text to a specific number of words
 * @param text - The text to truncate
 * @param wordCount - Maximum number of words (default: 12)
 */
export function truncateToWords(text: string, wordCount: number = 12): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) {
    return text;
  }
  return words.slice(0, wordCount).join(' ') + '...';
}
