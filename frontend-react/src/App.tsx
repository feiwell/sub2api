import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import type { ReactElement } from 'react'
import { useAuthStore } from './stores/authStore'
import { useAppStore } from './stores/appStore'
import { AppShell } from './components/layout/AppShell'
import { AdminShell } from './components/layout/AdminShell'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SetupPage } from './pages/SetupPage'
import { OAuthCallbackPage } from './pages/auth/OAuthCallbackPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProfilePage } from './pages/ProfilePage'
import { KeysPage } from './pages/KeysPage'
import { UsagePage } from './pages/UsagePage'
import { RedeemPage } from './pages/RedeemPage'
import { SubscriptionsPage } from './pages/SubscriptionsPage'
import { OrdersPage } from './pages/OrdersPage'
import { MCPPage } from './pages/MCPPage'
import { AffiliatePage } from './pages/AffiliatePage'
import { ModelPlazaPage } from './pages/ModelPlazaPage'
import { HomePage } from './pages/HomePage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage'
import { AdminChannelsPage } from './pages/admin/AdminChannelsPage'
import { AdminGroupsPage } from './pages/admin/AdminGroupsPage'
import { AdminAccountsPage } from './pages/admin/AdminAccountsPage'
import { AdminProxiesPage } from './pages/admin/AdminProxiesPage'
import { AdminAuditLogPage } from './pages/admin/AdminAuditLogPage'
import { AdminRedeemCodesPage } from './pages/admin/AdminRedeemCodesPage'
import { AdminUsageLogsPage } from './pages/admin/AdminUsageLogsPage'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'
import { AdminSubscriptionsPage } from './pages/admin/AdminSubscriptionsPage'
import { AdminBackupPage } from './pages/admin/AdminBackupPage'
import { AdminPluginsPage } from './pages/admin/AdminPluginsPage'
import { AdminChannelMonitorPage } from './pages/admin/AdminChannelMonitorPage'
import { NotFoundPage } from './pages/NotFoundPage'

function RequireAuth({ children }: { children: ReactElement }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

function RequireAdmin({ children }: { children: ReactElement }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

/**
 * On boot: load public settings (site name/logo) and check setup status,
 * mirroring the original App.vue onMounted flow. Redirect to /setup when needed.
 */
function useBoot() {
  const navigate = useNavigate()
  const location = useLocation()
  const fetchPublicSettings = useAppStore((s) => s.fetchPublicSettings)
  const fetchSetupStatus = useAppStore((s) => s.fetchSetupStatus)

  useEffect(() => {
    void fetchPublicSettings()
    void fetchSetupStatus().then((needed) => {
      if (needed && location.pathname !== '/setup') {
 navigate('/setup', { replace: true })
      }
    })
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export function App() {
  useBoot()
  return (
    <Routes>
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/callback" element={<OAuthCallbackPage />} />
      <Route path="/auth/oauth/callback" element={<OAuthCallbackPage />} />
      <Route path="/auth/linuxdo/callback" element={<OAuthCallbackPage />} />
      <Route path="/auth/wechat/callback" element={<OAuthCallbackPage />} />
      <Route path="/auth/dingtalk/callback" element={<OAuthCallbackPage />} />
      <Route path="/auth/oidc/callback" element={<OAuthCallbackPage />} />

      <Route
 element={
   <RequireAuth>
            <AppShell />
   </RequireAuth>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/keys" element={<KeysPage />} />
        <Route path="/usage" element={<UsagePage />} />
 <Route path="/redeem" element={<RedeemPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
 <Route path="/orders" element={<OrdersPage />} />
 <Route path="/mcp" element={<MCPPage />} />
 <Route path="/affiliate" element={<AffiliatePage />} />
 <Route path="/models" element={<ModelPlazaPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route
        element={
   <RequireAdmin>
     <AdminShell />
   </RequireAdmin>
        }
      >
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
 <Route path="/admin/announcements" element={<AdminAnnouncementsPage />} />
 <Route path="/admin/channels" element={<AdminChannelsPage />} />
 <Route path="/admin/groups" element={<AdminGroupsPage />} />
 <Route path="/admin/accounts" element={<AdminAccountsPage />} />
 <Route path="/admin/proxies" element={<AdminProxiesPage />} />
 <Route path="/admin/audit" element={<AdminAuditLogPage />} />
 <Route path="/admin/redeem-codes" element={<AdminRedeemCodesPage />} />
 <Route path="/admin/usage" element={<AdminUsageLogsPage />} />
 <Route path="/admin/settings" element={<AdminSettingsPage />} />
 <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />
 <Route path="/admin/backup" element={<AdminBackupPage />} />
 <Route path="/admin/plugins" element={<AdminPluginsPage />} />
 <Route path="/admin/channel-monitor" element={<AdminChannelMonitorPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
