import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import './styles/globals.css'
import './i18n'
import { Providers } from './providers'
import { App } from './App'
import { queryClient } from './lib/queryClient'
import { useAppStore } from './stores/appStore'
import { useAuthStore } from './stores/authStore'

// Restore persisted session + apply theme/site config before first paint.
useAppStore.getState().initFromInjectedConfig()
useAuthStore.getState().checkAuth()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
 <Providers>
   <App />
        </Providers>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
