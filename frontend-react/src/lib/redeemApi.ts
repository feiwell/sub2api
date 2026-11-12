// Redeem API, ported from Vue src/api/redeem.ts (subset).
import { apiClient } from './apiClient'

export interface RedeemResult {
  message: string
  type: string
  value: number
  new_balance?: number
  new_concurrency?: number
}

export const redeemApi = {
  async redeem(code: string): Promise<RedeemResult> {
    const { data } = await apiClient.post<RedeemResult>('/redeem', { code })
    return data
  },
}
