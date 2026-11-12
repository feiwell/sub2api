// Auth API, ported from the Vue frontend src/api/auth.ts (subset of endpoints).
import { apiClient } from './apiClient'
import type { LoginRequest, RegisterRequest, User } from './types'

export interface LoginResponse {
  access_token?: string
  token?: string
  refresh_token?: string
  expires_at?: number
  expires_in?: number
  user?: User
  requires_2fa?: boolean
  [key: string]: unknown
}

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload)
    return data
  },
  async register(payload: RegisterRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/register', payload)
    return data
  },
  async me(): Promise<User> {
    const { data } = await apiClient.get<User>('/user/profile')
    return data
  },
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      /* best-effort */
    }
  },
}
