/**
 * App store (Zustand): public site settings + theme, ported from Vue src/stores/app.ts (subset).
 */
import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'

export interface PublicSettings {
  site_name?: string
  site_logo?: string
  [key: string]: unknown
}

type ThemeMode = 'light' | 'dark'

interface AppState {
  siteName: string
  siteLogo: string
  publicSettings: PublicSettings | null
  setupNeeded: boolean | null
  theme: ThemeMode
  initFromInjectedConfig: () => void
  setPublicSettings: (settings: PublicSettings) => void
  fetchPublicSettings: () => Promise<void>
  fetchSetupStatus: () => Promise<boolean>
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

function applyThemeClass(mode: ThemeMode) {
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

function detectTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export const useAppStore = create<AppState>((set, get) => ({
  siteName: 'Sub2API',
  siteLogo: '',
  publicSettings: null,
  setupNeeded: null,
  theme: detectTheme(),

  initFromInjectedConfig: () => {
    const injected = (window.__APP_CONFIG__ || null) as PublicSettings | null
    const theme = detectTheme()
    applyThemeClass(theme)
    if (injected) {
      set({
        publicSettings: injected,
        siteName: (injected.site_name as string) || 'Sub2API',
        siteLogo: (injected.site_logo as string) || '',
        theme,
      })
    } else {
      set({ theme })
    }
  },

  setPublicSettings: (settings) =>
    set({
      publicSettings: settings,
      siteName: settings.site_name || 'Sub2API',
      siteLogo: settings.site_logo || '',
    }),

  fetchPublicSettings: async () => {
    try {
      const { data } = await apiClient.get<PublicSettings>('/settings/public')
      if (data && typeof data === 'object') {
 set({
   publicSettings: data,
   siteName: (data.site_name as string) || 'Sub2API',
   siteLogo: (data.site_logo as string) || '',
        })
        const name = (data.site_name as string) || ''
 if (name) document.title = `${name} - AI API Gateway`
      }
    } catch {
      /* keep defaults when settings endpoint is unavailable */
    }
  },

  fetchSetupStatus: async () => {
    try {
      const { data } = await apiClient.get<{ needs_setup?: boolean }>('/setup/status')
      const needed = !!data?.needs_setup
      set({ setupNeeded: needed })
      return needed
    } catch {
      set({ setupNeeded: false })
      return false
    }
  },

  toggleTheme: () => {
    const next: ThemeMode = get().theme === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* ignore */
    }
    applyThemeClass(next)
    set({ theme: next })
  },

  setTheme: (mode) => {
    try {
      localStorage.setItem('theme', mode)
    } catch {
      /* ignore */
    }
    applyThemeClass(mode)
    set({ theme: mode })
  },
}))
