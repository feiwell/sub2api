import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { Button } from '@astryxdesign/core/Button'
import { authApi } from '@/lib/authApi'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'
import type { ApiError, User } from '@/lib/types'
import { buildOAuthStartUrl } from '@/lib/apiUrl'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)
  const siteName = useAppStore((s) => s.siteName)

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard'

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const isEmail = identifier.includes('@')
      const res = await authApi.login({
 [isEmail ? 'email' : 'username']: identifier.trim(),
 password,
      })
      const token = res.access_token || res.token
      if (!token) throw { status: 0, message: 'No token returned' } as ApiError
      const user = (res.user || { id: identifier, username: identifier }) as User
      setSession({
        user,
        token,
 refreshToken: res.refresh_token ?? null,
        expiresAt: res.expires_at ?? (res.expires_in ? Date.now() + res.expires_in * 1000 : null),
      })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError((err as ApiError)?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <VStack height="100vh" vAlign="center" hAlign="center" padding={4} className="bg-background">
      <Card width={420} padding={8}>
 <form onSubmit={handleSubmit}>
   <VStack gap={5}>
     <VStack gap={1}>
       <Heading level={2}>{t('auth.loginTitle')}</Heading>
       <Text type="supporting">{siteName ? `${t('auth.loginSubtitle')}` : t('auth.loginSubtitle')}</Text>
     </VStack>

     <TextInput
label={t('auth.email') + ' / ' + t('auth.username')}
       value={identifier}
       onChange={(v) => setIdentifier(v)}
       placeholder="you@example.com"
       autoComplete="username"
       isRequired
width="100%"
     />
     <TextInput
type="password"
       label={t('auth.password')}
       value={password}
       onChange={(v) => setPassword(v)}
       autoComplete="current-password"
       isRequired
       width="100%"
       onEnter={() => void handleSubmit()}
       status={error ? { type: 'error', message: error } : undefined}
     />

            <Button
       type="submit"
       label={t('auth.login')}
       variant="primary"
       width="100%"
       isLoading={loading}
       clickAction={() => handleSubmit()}
     />

     <HStack gap={2} vAlign="center" justify="center">
       <Button
         label={t('auth.oauth.github')}
         variant="secondary"
  width="100%"
         onClick={() => { window.location.href = buildOAuthStartUrl('github') }}
       />
       <Button
         label={t('auth.oauth.google')}
  variant="secondary"
         width="100%"
         onClick={() => { window.location.href = buildOAuthStartUrl('google') }}
       />
     </HStack>

            <HStack gap={1} vAlign="center" justify="center">
       <Text type="supporting">{t('auth.noAccount')}</Text>
       <Link to="/register" style={{ textDecoration: 'none' }}>
         <Text color="accent">{t('auth.register')}</Text>
</Link>
     </HStack>
      <HStack justify="center">
        <Link to="/forgot-password" style={{ textDecoration: "none" }}>
   <Text type="supporting" color="accent">{t("auth.forgotTitle")}</Text>
        </Link>
      </HStack>
   </VStack>
        </form>
      </Card>
    </VStack>
  )
}
