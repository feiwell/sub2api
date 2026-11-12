// Admin API, ported from Vue src/api/admin/* (subset).
import { apiClient } from './apiClient'
import type {
  AdminUser,
  AdminDashboardStats,
  AdminUpdateUserRequest,
  Channel,
  AdminGroup,
  CreateGroupRequest,
  Account,
  Proxy,
  CreateProxyRequest,
  AuditLog,
  RedeemCode,
  GenerateRedeemCodesRequest,
  AdminUsageLog,
  UserSubscription,
  BackupRecord,
  PluginInstallation,
  ChannelMonitor,
  TrendResponse,
  PaginatedResponse,
} from './types'

export const adminApi = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const { data } = await apiClient.get<AdminDashboardStats>('/admin/dashboard/stats')
    return data
  },
  async getDashboardTrend(): Promise<TrendResponse> {
    const { data } = await apiClient.get<TrendResponse>('/admin/dashboard/trend')
    return data
  },
  async listUsers(
    page = 1,
    pageSize = 20,
    filters?: { status?: 'active' | 'disabled'; role?: 'admin' | 'user'; search?: string },
  ): Promise<PaginatedResponse<AdminUser>> {
    const { data } = await apiClient.get<PaginatedResponse<AdminUser>>('/admin/users', {
      params: { page, page_size: pageSize, ...filters },
    })
    return data
  },
  async updateUser(id: number, updates: AdminUpdateUserRequest): Promise<AdminUser> {
    const { data } = await apiClient.put<AdminUser>(`/admin/users/${id}`, updates)
    return data
  },
  async toggleUserStatus(id: number, status: 'active' | 'disabled'): Promise<AdminUser> {
    const { data } = await apiClient.put<AdminUser>(`/admin/users/${id}`, { status })
    return data
  },
  async deleteUser(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/users/${id}`)
    return data
  },

  // ---- Channels ----
  async listChannels(page = 1, pageSize = 50): Promise<PaginatedResponse<Channel>> {
    const { data } = await apiClient.get<PaginatedResponse<Channel>>('/admin/channels', {
      params: { page, page_size: pageSize },
    })
    return data
  },
  async deleteChannel(id: number): Promise<void> {
    await apiClient.delete(`/admin/channels/${id}`)
  },

  // ---- Groups ----
  async listGroups(): Promise<AdminGroup[]> {
    const { data } = await apiClient.get<AdminGroup[]>('/admin/groups/all')
    return data
  },
  async createGroup(payload: CreateGroupRequest): Promise<AdminGroup> {
    const { data } = await apiClient.post<AdminGroup>('/admin/groups', payload)
    return data
  },
  async toggleGroupStatus(id: number, status: 'active' | 'inactive'): Promise<AdminGroup> {
    const { data } = await apiClient.put<AdminGroup>(`/admin/groups/${id}`, { status })
    return data
  },
  async deleteGroup(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/groups/${id}`)
    return data
  },

  // ---- Accounts ----
  async listAccounts(page = 1, pageSize = 50): Promise<PaginatedResponse<Account>> {
    const { data } = await apiClient.get<PaginatedResponse<Account>>('/admin/accounts', {
      params: { page, page_size: pageSize },
    })
    return data
  },
  async toggleAccountStatus(id: number, status: 'active' | 'inactive'): Promise<Account> {
    const { data } = await apiClient.put<Account>(`/admin/accounts/${id}`, { status })
    return data
  },
  async deleteAccount(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/accounts/${id}`)
    return data
  },

  // ---- Proxies ----
  async listProxies(): Promise<Proxy[]> {
    const { data } = await apiClient.get<Proxy[]>('/admin/proxies/all')
    return data
  },
  async createProxy(payload: CreateProxyRequest): Promise<Proxy> {
    const { data } = await apiClient.post<Proxy>('/admin/proxies', payload)
    return data
  },
  async toggleProxyStatus(id: number, status: 'active' | 'inactive'): Promise<Proxy> {
    const { data } = await apiClient.put<Proxy>(`/admin/proxies/${id}`, { status })
    return data
  },
  async deleteProxy(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/proxies/${id}`)
    return data
  },

  // ---- Audit logs ----
  async listAuditLogs(page = 1, pageSize = 50): Promise<PaginatedResponse<AuditLog>> {
    const { data } = await apiClient.get<PaginatedResponse<AuditLog>>('/admin/audit-logs', {
      params: { page, page_size: pageSize },
    })
    return data
  },

  // ---- Redeem codes ----
  async listRedeemCodes(page = 1, pageSize = 50): Promise<PaginatedResponse<RedeemCode>> {
    const { data } = await apiClient.get<PaginatedResponse<RedeemCode>>('/admin/redeem-codes', {
      params: { page, page_size: pageSize },
    })
    return data
  },
  async generateRedeemCodes(payload: GenerateRedeemCodesRequest): Promise<RedeemCode[]> {
    const { data } = await apiClient.post<RedeemCode[]>('/admin/redeem-codes/generate', payload)
    return data
  },
  async deleteRedeemCode(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/redeem-codes/${id}`)
    return data
  },

  // ---- Usage logs ----
  async listUsageLogs(page = 1, pageSize = 50): Promise<PaginatedResponse<AdminUsageLog>> {
    const { data } = await apiClient.get<PaginatedResponse<AdminUsageLog>>('/admin/usage', {
      params: { page, page_size: pageSize },
    })
    return data
  },

  // ---- Subscriptions ----
  async listSubscriptions(page = 1, pageSize = 50): Promise<PaginatedResponse<UserSubscription>> {
    const { data } = await apiClient.get<PaginatedResponse<UserSubscription>>('/admin/subscriptions', {
      params: { page, page_size: pageSize },
    })
    return data
  },
  async revokeSubscription(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(`/admin/subscriptions/${id}/revoke`)
    return data
  },

  // ---- Backups ----
  async listBackups(): Promise<BackupRecord[]> {
    const { data } = await apiClient.get<{ items: BackupRecord[] }>('/admin/backups')
    return Array.isArray(data?.items) ? data.items : []
  },
  async createBackup(): Promise<BackupRecord> {
    const { data } = await apiClient.post<BackupRecord>('/admin/backups')
    return data
  },
  async deleteBackup(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/backups/${id}`)
    return data
  },

  // ---- Plugins ----
  async listPlugins(): Promise<PluginInstallation[]> {
    const { data } = await apiClient.get<PluginInstallation[]>('/admin/plugins')
    return Array.isArray(data) ? data : []
  },
  async enablePlugin(id: number, rolloutPercent = 100, acceptUntested = false): Promise<PluginInstallation> {
    const { data } = await apiClient.post<PluginInstallation>(`/admin/plugins/${id}/enable`, {
      rollout_percent: rolloutPercent,
      accept_untested: acceptUntested,
    })
    return data
  },
  async disablePlugin(id: number): Promise<PluginInstallation> {
    const { data } = await apiClient.post<PluginInstallation>(`/admin/plugins/${id}/disable`)
    return data
  },
  async deletePlugin(id: number): Promise<void> {
    await apiClient.delete(`/admin/plugins/${id}`)
  },

  // ---- Channel monitors ----
  async listChannelMonitors(page = 1, pageSize = 50): Promise<PaginatedResponse<ChannelMonitor>> {
    const { data } = await apiClient.get<PaginatedResponse<ChannelMonitor>>('/admin/channel-monitors', {
      params: { page, page_size: pageSize },
    })
    return data
  },
  async runChannelMonitor(id: number): Promise<unknown> {
    const { data } = await apiClient.post(`/admin/channel-monitors/${id}/run`)
    return data
  },
  async deleteChannelMonitor(id: number): Promise<void> {
    await apiClient.delete(`/admin/channel-monitors/${id}`)
  },
}

