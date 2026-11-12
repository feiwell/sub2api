import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HStack } from '@astryxdesign/core/HStack'
import { VStack } from '@astryxdesign/core/VStack'
import { Heading } from '@astryxdesign/core/Heading'
import { Button } from '@astryxdesign/core/Button'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import { setLocale, getLocale } from '@/i18n'

interface NavItem {
  to: string
  labelKey: string
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', labelKey: 'nav.dashboard' },
  { to: '/keys', labelKey: 'nav.keys' },
  { to: '/usage', labelKey: 'nav.usage' },
  { to: '/profile', labelKey: 'nav.profile' },
]

export function AppShell() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const siteName = useAppStore((s) => s.siteName)
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const user = useAuthStore((s) => s.user)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const nextLocale = getLocale().startsWith('zh') ? 'en' : 'zh'

  return (
    <VStack gap={0} height="100vh" className="bg-background">
      <HStack
 as="header"
        vAlign="center"
        justify="between"
        paddingInline={5}
        paddingBlock={3}
 gap={4}
        className="border-b border-subtle bg-surface"
      >
        <HStack gap={6} vAlign="center">
   <Heading level={4}>{siteName || 'Sub2API'}</Heading>
          <HStack as="nav" gap={1} vAlign="center">
     {NAV_ITEMS.map((item) => (
<NavLink key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
         {({ isActive }) => (
    <Button
      label={t(item.labelKey)}
      variant={isActive ? 'secondary' : 'ghost'}
      size="sm"
    />
         )}
       </NavLink>
     ))}
     {isAdmin ? (
<NavLink to="/admin" style={{ textDecoration: 'none' }}>
         {({ isActive }) => (
    <Button label={t('nav.admin')} variant={isActive ? 'secondary' : 'ghost'} size="sm" />
         )}
       </NavLink>
     ) : null}
          </HStack>
        </HStack>
 <HStack gap={2} vAlign="center">
          <Button label={nextLocale === 'zh' ? '中文' : 'EN'} variant="ghost" size="sm" onClick={() => setLocale(nextLocale)} />
          <Button label={theme === 'dark' ? '☀' : '☾'} variant="ghost" size="sm" onClick={toggleTheme} />
   <Button
     label={(user?.display_name as string) || (user?.username as string) || t('nav.profile')}
     variant="ghost"
     size="sm"
     href="/profile"
   />
   <Button label={t('nav.logout')} variant="secondary" size="sm" onClick={handleLogout} />
        </HStack>
      </HStack>

      <VStack isScrollable padding={6} gap={6} height="100%" className="bg-background">
        <Outlet />
      </VStack>
    </VStack>
  )
}
