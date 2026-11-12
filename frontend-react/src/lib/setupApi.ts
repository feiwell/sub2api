// First-run setup API, ported from Vue src/api/setup.ts.
// Uses a dedicated axios instance (setup endpoints live at /setup, not /api/v1,
// and need no auth token or response unwrapping).
import axios from 'axios'

const setupClient = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

export interface DatabaseConfig {
  host: string
  port: number
  user: string
  password: string
  dbname: string
  sslmode: string
}

export interface RedisConfig {
  host: string
  port: number
  username: string
  password: string
  db: number
  enable_tls: boolean
}

export interface AdminConfig {
  email: string
  password: string
}

export interface ServerConfig {
  host: string
  port: number
  mode: string
}

export interface InstallRequest {
  database: DatabaseConfig
  redis: RedisConfig
  admin: AdminConfig
  server: ServerConfig
}

export const setupApi = {
  async getStatus(): Promise<{ needs_setup: boolean; step?: string }> {
    const { data } = await setupClient.get('/setup/status')
    return data
  },
  async testDatabase(config: DatabaseConfig): Promise<void> {
    await setupClient.post('/setup/test-db', config)
  },
  async testRedis(config: RedisConfig): Promise<void> {
    await setupClient.post('/setup/test-redis', config)
  },
  async install(req: InstallRequest): Promise<{ message: string; restart: boolean }> {
    const { data } = await setupClient.post('/setup/install', req)
    return data
  },
}
