import type { ReactNode } from 'react'
import { Theme } from '@astryxdesign/core/theme'
import { LinkProvider } from '@astryxdesign/core/Link'
import { neutralTheme } from '@astryxdesign/theme-neutral/built'
import { Link as RouterLink } from 'react-router-dom'

/**
 * Global Astryx providers. Theme supplies tokens + dark mode; LinkProvider routes
 * Astryx <Link>/<Button href> through react-router for client-side navigation.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <Theme theme={neutralTheme}>
      <LinkProvider component={RouterLink as never}>{children}</LinkProvider>
    </Theme>
  )
}
