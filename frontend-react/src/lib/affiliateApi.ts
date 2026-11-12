// Affiliate API, ported from Vue src/api/user.ts (subset).
import { apiClient } from './apiClient'
import type { UserAffiliateDetail } from './types'

export const affiliateApi = {
  async getDetail(): Promise<UserAffiliateDetail> {
    const { data } = await apiClient.get<UserAffiliateDetail>('/user/aff')
    return data
  },
  async transfer(): Promise<{ transferred_quota: number; balance: number }> {
    const { data } = await apiClient.post<{ transferred_quota: number; balance: number }>('/user/aff/transfer')
    return data
  },
}
