// Admin API, ported from Vue src/api/admin/* (subset).
import { apiClient } from './apiClient'
import type {
  AdminUser,
  AdminDashboardStats,
  AdminUpdateUserRequest,
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
}
