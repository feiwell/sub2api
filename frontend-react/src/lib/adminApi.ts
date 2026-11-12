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
  PaginatedResponse,
} from './types'

export const adminApi = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const { data } = await apiClient.get<AdminDashboardStats>('/admin/dashboard/stats')
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
}

