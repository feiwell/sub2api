// Model plaza API, ported from Vue src/api/modelPlaza.ts.
import { apiClient } from './apiClient'
import type { ModelPlazaResponse } from './types'

export const modelPlazaApi = {
  async get(): Promise<ModelPlazaResponse> {
    const { data } = await apiClient.get<ModelPlazaResponse>('/model-plaza')
    return data
  },
}
