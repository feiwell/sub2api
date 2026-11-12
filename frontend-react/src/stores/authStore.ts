/**
 * Auth store (Zustand), ported from the Vue Pinia store src/stores/auth.ts.
 * Keeps the same localStorage keys so sessions remain compatible with the backend.
 */
import { create } from 'zustand'
import type { User } from '@/lib/types'

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'
const REFRESH_TOKEN_KEY = 'refresh_token'
const TOKEN_EXPIRES_AT_KEY = 'token_expires_at'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  tokenExpiresAt: number | null
  isAuthenticated: boolean
  isAdmin: boolean
  checkAuth: () => void
  setSession: (payload: {
    user: User
    token: string
    refreshToken?: string | null
    expiresAt?: number | null
  }) => void
  setUser: (user: User) => void
  logout: () => void
}

function computeFlags(user: User | null, token: string | null) {
  return {
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  tokenExpiresAt: null,
  isAuthenticated: false,
  isAdmin: false,

  checkAuth: () => {
    try {
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY)
      const savedUser = localStorage.getItem(AUTH_USER_KEY)
      const savedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY)
      const savedExpires = localStorage.getItem(TOKEN_EXPIRES_AT_KEY)
      if (savedToken && savedUser) {
        const user = JSON.parse(savedUser) as User
 set({
   token: savedToken,
          user,
   refreshToken: savedRefresh,
          tokenExpiresAt: savedExpires ? Number(savedExpires) : null,
          ...computeFlags(user, savedToken),
 })
      }
    } catch {
      /* ignore corrupted storage */
    }
  },

  setSession: ({ user, token, refreshToken, expiresAt }) => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
      if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      if (expiresAt) localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(expiresAt))
    } catch {
      /* ignore */
    }
    set({
      user,
      token,
      refreshToken: refreshToken ?? null,
      tokenExpiresAt: expiresAt ?? null,
      ...computeFlags(user, token),
    })
  },

  setUser: (user) =>
    set((state) => {
      try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
      } catch {
        /* ignore */
      }
      return { user, ...computeFlags(user, state.token) }
    }),

  logout: () => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(TOKEN_EXPIRES_AT_KEY)
    } catch {
      /* ignore */
    }
    set({
      user: null,
      token: null,
      refreshToken: null,
      tokenExpiresAt: null,
      isAuthenticated: false,
      isAdmin: false,
    })
  },
}))
