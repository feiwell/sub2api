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

export interface UserSubscription {
  id: number
  user_id: number
  group_id: number
  status: 'active' | 'expired' | 'revoked' | 'suspended' | string
  starts_at: string
  daily_usage_usd: number
  weekly_usage_usd: number
  monthly_usage_usd: number
  created_at: string
  expires_at: string | null
  group?: { id: number; name?: string; [key: string]: unknown }
}

export interface Announcement {
  id: number
  title: string
  content: string
  status: string
  notify_mode?: string
  starts_at?: string
  ends_at?: string
  created_at: string
  updated_at: string
}

export interface CreateAnnouncementRequest {
  title: string
  content: string
  status?: string
}

export interface Channel {
  id: number
  name: string
  description?: string
  status?: string
  group_ids?: number[]
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface AdminGroup {
  id: number
  name: string
  description?: string | null
  platform?: string
  status?: 'active' | 'inactive' | string
  rate_multiplier?: number
  is_exclusive?: boolean
  created_at?: string
  [key: string]: unknown
}

export interface CreateGroupRequest {
  name: string
  description?: string | null
  platform?: string
  rate_multiplier?: number
}

export interface Account {
  id: number
  name: string
  platform?: string
  type?: string
  status?: 'active' | 'inactive' | string
  notes?: string | null
  created_at?: string
  [key: string]: unknown
}

export interface PaymentOrder {
  id: number
  amount: number
  pay_amount?: number
  currency?: string
  payment_type?: string
  out_trade_no: string
  status: string
  order_type?: string
  created_at: string
  paid_at?: string
  [key: string]: unknown
}

export interface Proxy {
  id: number
  name: string
  protocol: string
  host: string
  port: number
  username?: string | null
  status: 'active' | 'inactive' | 'expired' | string
  account_count?: number
  country?: string
  created_at?: string
  [key: string]: unknown
}

export interface CreateProxyRequest {
  name: string
  protocol: string
  host: string
  port: number
  username?: string | null
  password?: string | null
}

export interface AuditLog {
  id: number
  created_at: string
  actor_email: string
  actor_role?: string
  action: string
  method?: string
  path?: string
  status_code?: number
  client_ip?: string
  [key: string]: unknown
}

export type RedeemCodeType = 'balance' | 'concurrency' | 'subscription' | 'invitation'

export interface RedeemCode {
  id: number
  code: string
  type: RedeemCodeType | string
  value: number
  status: 'active' | 'used' | 'expired' | 'unused' | 'disabled' | string
  used_at: string | null
  created_at: string
  expires_at?: string | null
  [key: string]: unknown
}

export interface GenerateRedeemCodesRequest {
  count: number
  type: RedeemCodeType | string
  value: number
  expires_in_days?: number
}

export interface AdminUsageLog {
  id: number
  user_id: number
  model: string
  total_cost?: number
  input_tokens?: number
  output_tokens?: number
  created_at?: string
  [key: string]: unknown
}

export interface SystemSettings {
  site_name?: string
  site_logo?: string
  contact_info?: string
  frontend_url?: string
  registration_enabled?: boolean
  email_verify_enabled?: boolean
  promo_code_enabled?: boolean
  password_reset_enabled?: boolean
  invitation_code_enabled?: boolean
  totp_enabled?: boolean
  passkey_enabled?: boolean
  default_balance?: number
  default_concurrency?: number
  [key: string]: unknown
}

export interface MCPGrant {
  id: string
  client_id: string
  client_name: string
  scope: string
  read_only: boolean
  created_at: string
  expires_at: string
  last_used_at: string | null
  revoked_at: string | null
  invalidated: boolean
}

export interface AffiliateInvitee {
  id?: number
  email?: string
  created_at?: string
  [key: string]: unknown
}

export interface UserAffiliateDetail {
  user_id: number
  aff_code: string
  aff_count: number
  aff_quota: number
  aff_frozen_quota: number
  aff_history_quota: number
  effective_rebate_rate_percent: number
  invitees: AffiliateInvitee[]
}

export interface PlazaModel {
  name: string
  platform: string
  [key: string]: unknown
}

export interface ModelPlazaGroup {
  id: number
  name: string
  description?: string
  platform: string
  subscription_type?: string
  rate_multiplier?: number
  models: PlazaModel[]
  [key: string]: unknown
}

export interface ModelPlazaResponse {
  description?: string
  groups: ModelPlazaGroup[]
}

export interface BackupRecord {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed' | string
  backup_type?: string
  file_name?: string
  size_bytes?: number
  triggered_by?: string
  started_at?: string
  finished_at?: string
  [key: string]: unknown
}

export interface PluginInstallation {
  id: number
  plugin_key: string
  name: string
  version: string
  description?: string
  author?: string
  signature_status?: 'trusted' | 'unsigned' | string
  state: 'disabled' | 'starting' | 'enabled' | 'error' | 'incompatible' | string
  last_error?: string
  installed_at?: string
  [key: string]: unknown
}

export interface ChannelMonitor {
  id: number
  name: string
  provider?: string
  endpoint?: string
  primary_model?: string
  group_name?: string
  enabled: boolean
  interval_seconds?: number
  [key: string]: unknown
}
