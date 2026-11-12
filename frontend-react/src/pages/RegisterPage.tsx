import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
import type { ApiError, User } from '@/lib/types'

export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await authApi.register({ username: username.trim(), email: email.trim(), password })
      const token = res.access_token || res.token
      if (token) {
 const user = (res.user || { id: email, username, email }) as User
 setSession({
   user,
          token,
   refreshToken: res.refresh_token ?? null,
          expiresAt: res.expires_at ?? (res.expires_in ? Date.now() + res.expires_in * 1000 : null),
 })
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    } catch (err) {
      setError((err as ApiError)?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <VStack height="100vh" vAlign="center" hAlign="center" padding={4} className="bg-background">
      <Card width={420} padding={8}>
        <form onSubmit={handleSubmit}>
          <VStack gap={5}>
            <Heading level={2}>{t('auth.registerTitle')}</Heading>

            <TextInput label={t('auth.username')} value={username} onChange={setUsername} autoComplete="username" width="100%" isRequired />
     <TextInput type="email" label={t('auth.email')} value={email} onChange={setEmail} autoComplete="email" width="100%" isRequired />
     <TextInput
       type="password"
       label={t('auth.password')}
       value={password}
onChange={setPassword}
       autoComplete="new-password"
       width="100%"
       isRequired
       onEnter={() => void handleSubmit()}
       status={error ? { type: 'error', message: error } : undefined}
     />

     <Button type="submit" label={t('auth.register')} variant="primary" width="100%" isLoading={loading} clickAction={() => handleSubmit()} />

     <HStack gap={1} vAlign="center" justify="center">
       <Text type="supporting">{t('auth.haveAccount')}</Text>
       <Link to="/login" style={{ textDecoration: 'none' }}>
         <Text color="accent">{t('auth.login')}</Text>
       </Link>
            </HStack>
          </VStack>
        </form>
      </Card>
    </VStack>
  )
}
