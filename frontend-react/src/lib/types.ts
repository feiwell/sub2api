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

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  pages: number
}

export interface ApiKey {
  id: number
  user_id: number
  key: string
  name: string
  group_id: number | null
  status: 'active' | 'inactive' | 'quota_exhausted' | 'expired'
  ip_whitelist: string[]
  ip_blacklist: string[]
  last_used_at: string | null
  quota: number
  quota_used: number
  expires_at: string | null
  created_at: string
  updated_at: string
  current_concurrency?: number
}

export interface CreateApiKeyRequest {
  name: string
  group_id?: number | null
  custom_key?: string
  quota?: number
  expires_in_days?: number
}

export interface UpdateApiKeyRequest {
  name?: string
  status?: 'active' | 'inactive'
  quota?: number
  expires_at?: string | null
  reset_quota?: boolean
}

export interface UserDashboardStats {
  total_requests?: number
  total_tokens?: number
  total_cost?: number
  balance?: number
  today_requests?: number
  today_cost?: number
  [key: string]: unknown
}

export interface UpdateProfileRequest {
  username?: string
  avatar_url?: string | null
}

export interface AdminUser extends User {
  balance?: number
  status?: 'active' | 'disabled' | string
  notes?: string
  created_at?: string
  last_used_at?: string | null
  current_concurrency?: number
}

export interface AdminDashboardStats {
  total_users?: number
  today_new_users?: number
  active_users?: number
  total_api_keys?: number
  active_api_keys?: number
  total_accounts?: number
  normal_accounts?: number
  error_accounts?: number
  total_requests?: number
  total_tokens?: number
  total_cost?: number
  today_requests?: number
  today_tokens?: number
  today_cost?: number
  rpm?: number
  tpm?: number
  [key: string]: unknown
}

export interface AdminUpdateUserRequest {
  username?: string
  email?: string
  role?: 'admin' | 'user'
  status?: 'active' | 'disabled'
  balance?: number
  notes?: string
}
