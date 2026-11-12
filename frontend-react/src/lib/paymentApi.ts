// Payment/orders API, ported from Vue src/api/payment.ts (subset).
import { apiClient } from './apiClient'
import type { PaymentOrder, PaginatedResponse } from './types'

export const paymentApi = {
  async getMyOrders(
    page = 1,
    pageSize = 20,
    status?: string,
  ): Promise<PaginatedResponse<PaymentOrder>> {
    const { data } = await apiClient.get<PaginatedResponse<PaymentOrder>>('/payment/orders/my', {
      params: { page, page_size: pageSize, status },
    })
    return data
  },
}
