export type MonthlyStats = {
  id?: number
  month: string
  views: number
  watch_time: number
  revenue: number
  views_growth: string
  watch_time_growth: string
  revenue_growth: string
  created_at?: string
}

export interface WeeklyStats {
  id?: number
  week: string
  revenue: number
  revenueGrowth: string
  created_at?: string
} 