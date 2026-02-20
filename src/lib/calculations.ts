/**
 * Calculation utilities for metrics and statistics
 */

import type { SupplyInfo, PricePerformance } from "@/types"

/**
 * Calculate supply information and percentages
 */
export function calculateSupplyInfo(
  circulating: number,
  total: number | null,
  max: number | null
): SupplyInfo {
  const percentCirculating = max
    ? (circulating / max) * 100
    : total
    ? (circulating / total) * 100
    : 100

  return {
    circulating,
    total,
    max,
    percentCirculating: Math.min(100, percentCirculating),
  }
}

/**
 * Calculate price performance for different time periods
 */
export function calculatePricePerformance(
  currentPrice: number,
  marketData: {
    price_change_percentage_1h_in_currency?: Record<string, number>
    price_change_percentage_24h_in_currency?: Record<string, number>
    price_change_percentage_7d_in_currency?: Record<string, number>
    price_change_percentage_30d_in_currency?: Record<string, number>
    price_change_percentage_1y_in_currency?: Record<string, number>
  },
  currency: string = "usd"
): PricePerformance[] {
  const performance: PricePerformance[] = []

  const periods = [
    { key: "1h", label: "1 Hour" },
    { key: "24h", label: "24 Hours" },
    { key: "7d", label: "7 Days" },
    { key: "30d", label: "30 Days" },
    { key: "1y", label: "1 Year" },
  ]

  periods.forEach(({ key, label }) => {
    const dataKey = `price_change_percentage_${key}_in_currency` as keyof typeof marketData
    const changePercent = marketData[dataKey]?.[currency] ?? 0
    const change = (currentPrice * changePercent) / 100

    performance.push({
      period: label,
      change,
      changePercent,
    })
  })

  return performance
}

/**
 * Calculate market cap dominance
 * @param marketCap - Coin market cap
 * @param totalMarketCap - Total crypto market cap
 */
export function calculateMarketCapDominance(
  marketCap: number,
  totalMarketCap: number
): number {
  if (!totalMarketCap || totalMarketCap === 0) return 0
  return (marketCap / totalMarketCap) * 100
}

/**
 * Calculate percentage from ATH (All-Time High)
 */
export function calculateFromATH(
  currentPrice: number,
  athPrice: number
): number {
  if (!athPrice || athPrice === 0) return 0
  return ((currentPrice - athPrice) / athPrice) * 100
}

/**
 * Calculate percentage from ATL (All-Time Low)
 */
export function calculateFromATL(
  currentPrice: number,
  atlPrice: number
): number {
  if (!atlPrice || atlPrice === 0) return 0
  return ((currentPrice - atlPrice) / atlPrice) * 100
}

/**
 * Calculate diluted market cap if fully diluted valuation exists
 */
export function calculateFDV(
  currentPrice: number,
  maxSupply: number | null
): number | null {
  if (!maxSupply || maxSupply === 0) return null
  return currentPrice * maxSupply
}

/**
 * Calculate circulating supply ratio
 */
export function calculateCirculatingRatio(
  circulatingSupply: number,
  totalSupply: number | null,
  maxSupply: number | null
): number {
  const denominator = maxSupply || totalSupply
  if (!denominator || denominator === 0) return 100
  return (circulatingSupply / denominator) * 100
}

/**
 * Calculate average from array of numbers
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0
  const sum = numbers.reduce((acc, val) => acc + val, 0)
  return sum / numbers.length
}

/**
 * Calculate volatility (standard deviation) from price data
 */
export function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0

  const mean = calculateAverage(prices)
  const squaredDiffs = prices.map((price) => Math.pow(price - mean, 2))
  const variance = calculateAverage(squaredDiffs)
  const standardDeviation = Math.sqrt(variance)

  // Return as percentage of mean
  return (standardDeviation / mean) * 100
}

/**
 * Calculate price change between two values
 */
export function calculateChange(
  currentValue: number,
  previousValue: number
): { absolute: number; percentage: number } {
  const absolute = currentValue - previousValue
  const percentage = previousValue !== 0 ? (absolute / previousValue) * 100 : 0

  return { absolute, percentage }
}

/**
 * Safely divide two numbers, return 0 if denominator is 0
 */
export function safeDivide(
  numerator: number,
  denominator: number,
  defaultValue: number = 0
): number {
  if (denominator === 0) return defaultValue
  return numerator / denominator
}

/**
 * Calculate 52-week high/low from historical data
 */
export function calculate52WeekRange(
  prices: [number, number][]
): { high: number; low: number; highDate: number; lowDate: number } | null {
  if (!prices || prices.length === 0) {
    return null
  }

  const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000
  const yearPrices = prices.filter(([timestamp]) => timestamp >= oneYearAgo)

  if (yearPrices.length === 0) {
    return null
  }

  let high = -Infinity
  let low = Infinity
  let highDate = 0
  let lowDate = 0

  yearPrices.forEach(([timestamp, price]) => {
    if (price > high) {
      high = price
      highDate = timestamp
    }
    if (price < low) {
      low = price
      lowDate = timestamp
    }
  })

  return { high, low, highDate, lowDate }
}
