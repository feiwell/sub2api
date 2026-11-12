// Admin system settings API, ported from Vue src/api/admin/settings.ts (subset).
import { apiClient } from './apiClient'
import type { SystemSettings } from './types'

export const adminSettingsApi = {
  async get(): Promise<SystemSettings> {
    const { data } = await apiClient.get<SystemSettings>('/admin/settings')
    return data
  },
  async update(patch: Partial<SystemSettings>): Promise<SystemSettings> {
    const { data } = await apiClient.put<SystemSettings>('/admin/settings', patch)
    return data
  },
}
