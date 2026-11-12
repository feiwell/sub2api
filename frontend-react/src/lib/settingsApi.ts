// Public settings + setup status, ported from Vue src/api (subset).
import { apiClient } from './apiClient'
import type { PublicSettings } from '@/stores/appStore'

export interface SetupStatus {
  needs_setup: boolean
  step?: string
}

export const settingsApi = {
  async getPublicSettings(): Promise<PublicSettings> {
    const { data } = await apiClient.get<PublicSettings>('/settings/public')
    return data
  },
  async getSetupStatus(): Promise<SetupStatus> {
    const { data } = await apiClient.get<SetupStatus>('/setup/status')
    return data
  },
}
