// TOTP + passkey read APIs, ported from Vue src/api (subset).
import { apiClient } from './apiClient'
import type { TotpStatus, PasskeyCredentialSummary } from './types'

export const securityApi = {
  async getTotpStatus(): Promise<TotpStatus> {
    const { data } = await apiClient.get<TotpStatus>('/user/totp/status')
    return data
  },
  async listPasskeys(): Promise<PasskeyCredentialSummary[]> {
    const { data } = await apiClient.get<PasskeyCredentialSummary[]>('/user/passkeys')
    return Array.isArray(data) ? data : []
  },
}
