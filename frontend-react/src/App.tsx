import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactElement } from 'react'
import { useAuthStore } from './stores/authStore'
import { AppShell } from './components/layout/AppShell'
import { AdminShell } from './components/layout/AdminShell'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProfilePage } from './pages/ProfilePage'
import { KeysPage } from './pages/KeysPage'
import { UsagePage } from './pages/UsagePage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
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

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

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
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
