// Usage API, ported from Vue src/api/usage.ts (subset).
import { apiClient } from './apiClient'
import type { UserDashboardStats, TrendResponse } from './types'

export const usageApi = {
  async getDashboardStats(): Promise<UserDashboardStats> {
    const { data } = await apiClient.get<UserDashboardStats>('/usage/dashboard/stats')
    return data
  },
  async getDashboardTrend(): Promise<TrendResponse> {
    const { data } = await apiClient.get<TrendResponse>('/usage/dashboard/trend')
    return data
  },
}
