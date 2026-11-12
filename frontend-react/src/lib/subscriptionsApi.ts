// User subscriptions API, ported from Vue src/api/subscriptions.ts (subset).
import { apiClient } from './apiClient'
import type { UserSubscription } from './types'

export const subscriptionsApi = {
  async getMine(): Promise<UserSubscription[]> {
    const { data } = await apiClient.get<UserSubscription[]>('/subscriptions')
    return data
  },
  async getActive(): Promise<UserSubscription[]> {
    const { data } = await apiClient.get<UserSubscription[]>('/subscriptions/active')
    return data
  },
}
