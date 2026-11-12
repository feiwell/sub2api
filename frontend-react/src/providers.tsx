import { forwardRef, type AnchorHTMLAttributes, type ReactNode, type Ref } from 'react'
import { Theme } from '@astryxdesign/core/theme'
import { LinkProvider } from '@astryxdesign/core/Link'
import { neutralTheme } from '@astryxdesign/theme-neutral/built'
import { Link as RouterLink } from 'react-router-dom'

/**
 * Adapter so Astryx's link-rendering components (Link, Button href, ...) navigate
 * through react-router. Astryx passes both `href` and `to`; react-router needs `to`.
 * Internal paths use client-side routing; external/absolute URLs fall back to <a>.
 */
type AstryxLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string
  to?: string
}

const RouterLinkAdapter = forwardRef(function RouterLinkAdapter(
  { href, to, children, ...rest }: AstryxLinkProps,
  ref: Ref<HTMLAnchorElement>,
) {
  const dest = to ?? href ?? ''
  const isExternal = /^[a-z][a-z\d+.-]*:/i.test(dest) || dest.startsWith('//')
  if (!dest || isExternal) {
    return (
      <a ref={ref} href={dest} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <RouterLink ref={ref} to={dest} {...rest}>
      {children}
    </RouterLink>
  )
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Theme theme={neutralTheme}>
      <LinkProvider component={RouterLinkAdapter}>{children}</LinkProvider>
    </Theme>
  )
}
