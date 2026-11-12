// Announcements API, ported from Vue src/api (admin + user subsets).
import { apiClient } from './apiClient'
import type { Announcement, CreateAnnouncementRequest, PaginatedResponse } from './types'

export const adminAnnouncementsApi = {
  async list(page = 1, pageSize = 50): Promise<PaginatedResponse<Announcement>> {
    const { data } = await apiClient.get<PaginatedResponse<Announcement>>('/admin/announcements', {
      params: { page, page_size: pageSize },
    })
    return data
  },
  async create(payload: CreateAnnouncementRequest): Promise<Announcement> {
    const { data } = await apiClient.post<Announcement>('/admin/announcements', payload)
    return data
  },
  async remove(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/announcements/${id}`)
    return data
  },
}
