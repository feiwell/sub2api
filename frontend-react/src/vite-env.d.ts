/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_DEV_PROXY_TARGET?: string
  readonly VITE_DEV_PORT?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  __APP_CONFIG__?: Record<string, unknown>
}
