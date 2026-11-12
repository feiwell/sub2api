// API Keys, ported from Vue src/api/keys.ts (subset).
import { apiClient } from './apiClient'
import type {
  ApiKey,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  PaginatedResponse,
} from './types'

export const keysApi = {
  async list(
    page = 1,
    pageSize = 20,
    filters?: { search?: string; status?: string },
  ): Promise<PaginatedResponse<ApiKey>> {
    const { data } = await apiClient.get<PaginatedResponse<ApiKey>>('/keys', {
      params: { page, page_size: pageSize, ...filters },
    })
    return data
  },
  async create(payload: CreateApiKeyRequest): Promise<ApiKey> {
    const { data } = await apiClient.post<ApiKey>('/keys', payload)
    return data
  },
  async update(id: number, updates: UpdateApiKeyRequest): Promise<ApiKey> {
    const { data } = await apiClient.put<ApiKey>(`/keys/${id}`, updates)
    return data
  },
  async toggleStatus(id: number, status: 'active' | 'inactive'): Promise<ApiKey> {
    return this.update(id, { status })
  },
  async remove(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/keys/${id}`)
    return data
  },
}
