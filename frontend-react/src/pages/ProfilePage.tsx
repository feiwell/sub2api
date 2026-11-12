import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { Button } from '@astryxdesign/core/Button'
import { userApi } from '@/lib/userApi'
import { useAuthStore } from '@/stores/authStore'
import type { ApiError, User } from '@/lib/types'
import { toast } from '@/lib/toast'

export function ProfilePage() {
  const { t } = useTranslation()
  const setUser = useAuthStore((s) => s.setUser)
  const cachedUser = useAuthStore((s) => s.user)

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile(),
  })

  const [username, setUsername] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState<string | null>(null)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [savingPwd, setSavingPwd] = useState(false)
  const [pwdMsg, setPwdMsg] = useState<string | null>(null)
  const [pwdErr, setPwdErr] = useState<string | null>(null)

  const profile = (data || cachedUser) as User | null

  useEffect(() => {
    if (profile?.username) setUsername(profile.username as string)
  }, [profile?.username])

  async function saveProfile() {
    setSavingProfile(true)
    setProfileMsg(null)
    try {
      const updated = await userApi.updateProfile({ username: username.trim() })
      setUser(updated)
      toast.success(t('profile.saved'))
    } catch (err) {
      setProfileMsg((err as ApiError)?.message || 'Error')
    } finally {
      setSavingProfile(false)
    }
  }

  async function savePassword() {
    setPwdErr(null)
    setPwdMsg(null)
    setSavingPwd(true)
    try {
      await userApi.changePassword(oldPassword, newPassword)
      toast.success(t('profile.passwordChanged'))
      setOldPassword('')
      setNewPassword('')
    } catch (err) {
      setPwdErr((err as ApiError)?.message || 'Error')
    } finally {
      setSavingPwd(false)
    }
  }

  return (
    <VStack gap={6} width="100%" maxWidth={720}>
      <Heading level={2}>{t('profile.title')}</Heading>

      <Card padding={6}>
        <VStack gap={4}>
          <Heading level={4}>{t('profile.account')}</Heading>
          <HStack gap={6} wrap="wrap">
     <VStack gap={1}>
       <Text type="supporting">{t('auth.email')}</Text>
<Text>{(profile?.email as string) || '—'}</Text>
            </VStack>
     <VStack gap={1}>
       <Text type="supporting">{t('profile.role')}</Text>
       <Text>{(profile?.role as string) || 'user'}</Text>
     </VStack>
          </HStack>
          <TextInput
     label={t('auth.username')}
     value={username}
     onChange={setUsername}
     width="100%"
     isLoading={isLoading}
          />
          {profileMsg ? <Text color="accent">{profileMsg}</Text> : null}
          <HStack>
            <Button label={t('common.submit')} variant="primary" isLoading={savingProfile} clickAction={saveProfile} />
   </HStack>
        </VStack>
      </Card>

      <Card padding={6}>
        <VStack gap={4}>
          <Heading level={4}>{t('profile.changePassword')}</Heading>
          <TextInput type="password" label={t('profile.oldPassword')} value={oldPassword} onChange={setOldPassword} width="100%" autoComplete="current-password" />
   <TextInput
     type="password"
     label={t('profile.newPassword')}
     value={newPassword}
     onChange={setNewPassword}
            width="100%"
            autoComplete="new-password"
     status={pwdErr ? { type: 'error', message: pwdErr } : undefined}
          />
          {pwdMsg ? <Text color="accent">{pwdMsg}</Text> : null}
          <HStack>
     <Button label={t('profile.changePassword')} variant="primary" isLoading={savingPwd} clickAction={savePassword} />
          </HStack>
        </VStack>
      </Card>
    </VStack>
  )
}
