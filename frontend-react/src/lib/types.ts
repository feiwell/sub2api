// Core shared types (subset ported from the Vue frontend; extended as pages migrate).
export interface ApiResponse<T> {
  code: number
  message?: string
  data?: T
  reason?: string
  metadata?: Record<string, unknown>
}

export interface ApiError {
  status: number
  code?: string | number
  message: string
  reason?: unknown
  metadata?: unknown
  retry_after_seconds?: number
}

export interface User {
  id: number | string
  username?: string
  email?: string
  display_name?: string
  avatar_url?: string
  role?: 'admin' | 'user' | string
  [key: string]: unknown
}

export interface LoginRequest {
  username?: string
  email?: string
  password: string
}

export interface RegisterRequest {
  username?: string
  email: string
  password: string
  [key: string]: unknown
}
