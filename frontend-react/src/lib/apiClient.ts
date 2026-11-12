/**
 * Axios HTTP client, ported from the Vue frontend (src/api/client.ts).
 * Framework-agnostic: preserves the { code, message, data } unwrapping,
 * bearer-token injection, Accept-Language, timezone params, and 401 refresh/redirect.
 */
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import type { ApiResponse } from './types'
import { getAPIBaseURL } from './apiUrl'

const LOCALE_KEY = 'sub2api_locale'

function getLocale(): string {
  try {
    return localStorage.getItem(LOCALE_KEY) || 'en'
  } catch {
    return 'en'
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: getAPIBaseURL(),
  withCredentials: true,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'UTC'
  }
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.headers) {
      config.headers['Accept-Language'] = getLocale()
    }
    if (config.method === 'get') {
      if (!config.params) config.params = {}
      config.params.timezone = getUserTimezone()
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const apiResponse = response.data as ApiResponse<unknown>
    if (apiResponse && typeof apiResponse === 'object' && 'code' in apiResponse) {
      if (apiResponse.code === 0) {
 response.data = apiResponse.data
      } else {
        const resp = apiResponse as unknown as Record<string, unknown>
        return Promise.reject({
          status: response.status,
          code: apiResponse.code,
          message: apiResponse.message || 'Unknown error',
   reason: resp.reason,
   metadata: resp.metadata,
        })
      }
    }
    return response
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.code === 'ERR_CANCELED' || axios.isCancel(error)) {
      return Promise.reject(error)
    }
    if (error.response) {
      const { status, data } = error.response
      const url = String(error.config?.url || '')
      const apiData = (typeof data === 'object' && data !== null ? data : {}) as Record<string, any>

      if (status === 401) {
        const isAuthEndpoint =
   url.includes('/auth/login') ||
   url.includes('/auth/register') ||
          url.includes('/auth/refresh')
 const hasToken = !!localStorage.getItem('auth_token')
 localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
 localStorage.removeItem('auth_user')
        localStorage.removeItem('token_expires_at')
 if (hasToken && !isAuthEndpoint) {
          sessionStorage.setItem('auth_expired', '1')
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
   }
        }
      }

      return Promise.reject({
 status,
        code: apiData.code,
        reason: apiData.reason,
        message: apiData.message || apiData.detail || error.message,
        metadata: apiData.metadata,
      })
    }
    return Promise.reject({
      status: 0,
      code: error.code || 'ERR_NETWORK',
      message: 'Network error. Please check your connection.',
    })
  },
)

export default apiClient
