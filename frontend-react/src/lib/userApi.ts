// User API, ported from Vue src/api/user.ts (subset).
import { apiClient } from './apiClient'
import type { User, UpdateProfileRequest } from './types'

export const userApi = {
  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>('/user/profile')
    return data
  },
  async updateProfile(profile: UpdateProfileRequest): Promise<User> {
    const { data } = await apiClient.put<User>('/user', profile)
    return data
  },
  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const { data } = await apiClient.put<{ message: string }>('/user/password', {
      old_password: oldPassword,
      new_password: newPassword,
    })
    return data
  },
}
