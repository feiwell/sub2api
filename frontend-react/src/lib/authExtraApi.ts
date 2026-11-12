// Forgot/reset password, ported from Vue src/api/auth.ts (subset).
import { apiClient } from './apiClient'

export const authExtraApi = {
  async forgotPassword(email: string): Promise<{ message?: string }> {
    const { data } = await apiClient.post<{ message?: string }>('/auth/forgot-password', { email })
    return data
  },
  async resetPassword(email: string, token: string, newPassword: string): Promise<{ message?: string }> {
    const { data } = await apiClient.post<{ message?: string }>('/auth/reset-password', {
      email,
      token,
      new_password: newPassword,
    })
    return data
  },
}
