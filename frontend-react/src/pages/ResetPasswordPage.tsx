import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { Button } from '@astryxdesign/core/Button'
import { authExtraApi } from '@/lib/authExtraApi'
import type { ApiError } from '@/lib/types'

export function ResetPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState(params.get('email') || '')
  const [token, setToken] = useState(params.get('token') || '')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit() {
    setErr(null)
    setLoading(true)
    try {
      await authExtraApi.resetPassword(email.trim(), token.trim(), password)
      navigate('/login', { replace: true })
    } catch (e) {
      setErr((e as ApiError)?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <VStack height="100vh" vAlign="center" hAlign="center" padding={4} className="bg-background">
      <Card width={420} padding={8}>
 <VStack gap={5}>
   <Heading level={2}>{t('auth.resetTitle')}</Heading>
   <TextInput type="email" label={t('auth.email')} value={email} onChange={setEmail} width="100%" autoComplete="email" />
          <TextInput label={t('auth.resetToken')} value={token} onChange={setToken} width="100%" />
   <TextInput
     type="password"
     label={t('profile.newPassword')}
     value={password}
     onChange={setPassword}
     width="100%"
     autoComplete="new-password"
     onEnter={submit}
     status={err ? { type: 'error', message: err } : undefined}
          />
          <Button label={t('common.submit')} variant="primary" width="100%" isLoading={loading} clickAction={submit} />
   <HStack justify="center">
     <Link to="/login" style={{ textDecoration: 'none' }}>
       <Text color="accent">{t('auth.login')}</Text>
     </Link>
          </HStack>
        </VStack>
      </Card>
    </VStack>
  )
}
