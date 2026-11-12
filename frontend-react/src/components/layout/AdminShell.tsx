import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HStack } from '@astryxdesign/core/HStack'
import { VStack } from '@astryxdesign/core/VStack'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Button } from '@astryxdesign/core/Button'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import { setLocale, getLocale } from '@/i18n'

interface NavItem {
  to: string
  labelKey: string
}

const ADMIN_NAV: NavItem[] = [
  { to: '/admin/dashboard', labelKey: 'admin.dashboard' },
  { to: '/admin/users', labelKey: 'admin.users' },
  { to: '/admin/announcements', labelKey: 'admin.announcements' },
  { to: '/admin/channels', labelKey: 'admin.channels' },
  { to: '/admin/groups', labelKey: 'admin.groups' },
  { to: '/admin/accounts', labelKey: 'admin.accounts' },
  { to: '/admin/proxies', labelKey: 'admin.proxies' },
  { to: '/admin/audit', labelKey: 'admin.auditLog' },
  { to: '/admin/redeem-codes', labelKey: 'admin.redeemCodes' },
  { to: '/admin/usage', labelKey: 'admin.usage' },
  { to: '/admin/settings', labelKey: 'admin.settings' },
  { to: '/admin/subscriptions', labelKey: 'admin.subscriptions' },
  { to: '/admin/backup', labelKey: 'admin.backup' },
  { to: '/admin/plugins', labelKey: 'admin.plugins' },
  { to: '/admin/channel-monitor', labelKey: 'admin.channelMonitor' },
  { to: '/admin/risk-control', labelKey: 'admin.riskControl' },
]

export function AdminShell() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const siteName = useAppStore((s) => s.siteName)
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const nextLocale = getLocale().startsWith('zh') ? 'en' : 'zh'

  return (
    <HStack gap={0} height="100vh" align="stretch" className="bg-background">
      <VStack
        as="aside"
        gap={1}
        padding={4}
        width={240}
        className="border-r border-subtle bg-surface"
      >
        <VStack gap={0} paddingBlockEnd={4}>
   <Heading level={5}>{siteName || 'Sub2API'}</Heading>
   <Text type="supporting">{t('admin.console')}</Text>
        </VStack>
 {ADMIN_NAV.map((item) => (
   <NavLink key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
     {({ isActive }) => (
       <Button
  label={t(item.labelKey)}
  variant={isActive ? 'secondary' : 'ghost'}
         size="md"
  width="100%"
       />
     )}
          </NavLink>
        ))}
        <VStack vAlign="end" height="100%" justify="end" gap={1}>
   <Button label={t('admin.backToApp')} variant="ghost" size="sm" width="100%" href="/dashboard" />
        </VStack>
      </VStack>

      <VStack gap={0} height="100vh" width="100%">
        <HStack
   as="header"
   vAlign="center"
   justify="end"
   gap={2}
          paddingInline={5}
          paddingBlock={3}
          className="border-b border-subtle bg-surface"
 >
          <Button label={nextLocale === 'zh' ? '中文' : 'EN'} variant="ghost" size="sm" onClick={() => setLocale(nextLocale)} />
          <Button label={theme === 'dark' ? '☀' : '☾'} variant="ghost" size="sm" onClick={toggleTheme} />
          <Button label={t('nav.logout')} variant="secondary" size="sm" onClick={() => { useAuthStore.getState().logout(); navigate('/login', { replace: true }) }} />
        </HStack>
        <VStack isScrollable padding={6} gap={6} height="100%">
   <Outlet />
        </VStack>
      </VStack>
    </HStack>
  )
}
