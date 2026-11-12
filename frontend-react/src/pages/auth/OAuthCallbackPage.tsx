import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Button } from '@astryxdesign/core/Button'
import { Spinner } from '@astryxdesign/core/Spinner'
import { userApi } from '@/lib/userApi'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/lib/types'

/**
 * Generic OAuth callback handler (ported from the Vue OAuth callback views).
 * The backend redirects here with tokens in the URL hash fragment:
 *   #access_token=...&refresh_token=...&expires_in=...
 * We parse them, persist the session, fetch the profile, then redirect.
 * On error (or missing tokens) we surface a message with a link back to login.
 */
export function OAuthCallbackPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const [error, setError] = useState<string | null>(null)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    async function run() {
      const rawHash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash
      const hashParams = new URLSearchParams(rawHash)
      const queryParams = new URLSearchParams(window.location.search)

      const errParam = queryParams.get('error') || queryParams.get('error_description') || hashParams.get('error')
      if (errParam) {
 setError(errParam)
 return
      }

      const accessToken = (hashParams.get('access_token') || queryParams.get('access_token') || '').trim()
      if (!accessToken) {
 setError(t('auth.oauth.missingToken'))
 return
      }
      const refreshToken = (hashParams.get('refresh_token') || '').trim() || null
      const expiresIn = Number.parseInt(hashParams.get('expires_in') || '', 10)
      const expiresAt = Number.isFinite(expiresIn) && expiresIn > 0 ? Date.now() + expiresIn * 1000 : null

      // Persist the access token first so the profile request is authenticated.
      try {
        localStorage.setItem('auth_token', accessToken)
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken)
        if (expiresAt) localStorage.setItem('token_expires_at', String(expiresAt))
      } catch {
 /* ignore */
      }

      try {
        const user = (await userApi.getProfile()) as User
 setSession({ user, token: accessToken, refreshToken, expiresAt })
        // Clean the sensitive hash from the URL before navigating.
        window.history.replaceState(null, '', window.location.pathname)
 navigate('/dashboard', { replace: true })
      } catch (e) {
        setError((e as { message?: string })?.message || t('auth.oauth.failed'))
      }
    }

    void run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <VStack height="100vh" vAlign="center" hAlign="center" padding={4} className="bg-background">
      <Card width={420} padding={8}>
        <VStack gap={4} hAlign="center">
   {error ? (
     <>
       <Heading level={3}>{t('auth.oauth.title')}</Heading>
       <Text color="accent">{error}</Text>
       <Button label={t('auth.login')} variant="primary" href="/login" />
     </>
   ) : (
     <>
       <Spinner label={t('common.processing')} />
       <Text type="supporting">{t('auth.oauth.processing')}</Text>
     </>
   )}
 </VStack>
      </Card>
    </VStack>
  )
}
