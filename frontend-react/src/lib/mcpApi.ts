// MCP API, ported from Vue src/api/mcp.ts (subset).
import { apiClient } from './apiClient'
import type { MCPGrant } from './types'

export const mcpApi = {
  async getConfig(): Promise<{ resource: string }> {
    const { data } = await apiClient.get<{ resource: string }>('/user/mcp/config')
    return data
  },
  async listGrants(): Promise<MCPGrant[]> {
    const { data } = await apiClient.get<MCPGrant[]>('/user/mcp/grants')
    return data
  },
  async revokeGrant(id: string): Promise<void> {
    await apiClient.delete(`/user/mcp/grants/${encodeURIComponent(id)}`)
  },
}
