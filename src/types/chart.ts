/**
 * Chart-specific types and interfaces
 */

export type ChartType = 'line' | 'candlestick' | 'area'

export type ChartTimeframe = '1D' | '7D' | '30D' | '90D' | '1Y' | 'ALL'

export interface ChartDataPoint {
  timestamp: number
  date: Date
  price: number
  volume?: number
  marketCap?: number
}

export interface OHLCDataPoint {
  timestamp: number
  date: Date
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export interface ChartTooltipData {
  date: string
  price: string
  volume?: string
  change?: string
  changePercent?: string
  open?: string
  high?: string
  low?: string
  close?: string
}

export interface ChartConfig {
  type: ChartType
  timeframe: ChartTimeframe
  showVolume: boolean
  showGrid: boolean
  height: number
  currency: string
}

// Timeframe to API days mapping
export const TIMEFRAME_TO_DAYS: Record<ChartTimeframe, string | number> = {
  '1D': 1,
  '7D': 7,
  '30D': 30,
  '90D': 90,
  '1Y': 365,
  'ALL': 'max'
}

// Timeframe to OHLC interval mapping (for candlestick charts)
export const TIMEFRAME_TO_INTERVAL: Record<ChartTimeframe, number> = {
  '1D': 1,    // 1 day = hourly candles
  '7D': 7,    // 7 days = 4-hour candles
  '30D': 30,  // 30 days = daily candles
  '90D': 90,  // 90 days = daily candles
  '1Y': 365,  // 1 year = weekly candles
  'ALL': 365  // All = monthly candles (approximation)
}
