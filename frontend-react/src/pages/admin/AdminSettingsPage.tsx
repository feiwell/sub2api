import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { Switch } from '@astryxdesign/core/Switch'
import { Button } from '@astryxdesign/core/Button'
import { adminSettingsApi } from '@/lib/adminSettingsApi'
import { toast } from '@/lib/toast'
import type { ApiError, SystemSettings } from '@/lib/types'

type TextField = { key: keyof SystemSettings; labelKey: string; numeric?: boolean }
type BoolField = { key: keyof SystemSettings; labelKey: string }

const SITE_TEXT: TextField[] = [
  { key: 'site_name', labelKey: 'admin.set.siteName' },
  { key: 'site_logo', labelKey: 'admin.set.siteLogo' },
  { key: 'contact_info', labelKey: 'admin.set.contact' },
  { key: 'frontend_url', labelKey: 'admin.set.frontendUrl' },
]

const DEFAULT_NUM: TextField[] = [
  { key: 'default_balance', labelKey: 'admin.set.defaultBalance', numeric: true },
  { key: 'default_concurrency', labelKey: 'admin.set.defaultConcurrency', numeric: true },
]

const TOGGLES: BoolField[] = [
  { key: 'registration_enabled', labelKey: 'admin.set.registration' },
  { key: 'email_verify_enabled', labelKey: 'admin.set.emailVerify' },
  { key: 'promo_code_enabled', labelKey: 'admin.set.promoCode' },
  { key: 'password_reset_enabled', labelKey: 'admin.set.passwordReset' },
  { key: 'invitation_code_enabled', labelKey: 'admin.set.invitationCode' },
  { key: 'totp_enabled', labelKey: 'admin.set.totp' },
  { key: 'passkey_enabled', labelKey: 'admin.set.passkey' },
]

export function AdminSettingsPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => adminSettingsApi.get(),
  })

  const [form, setForm] = useState<SystemSettings>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  function setField<K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function save() {
    setSaving(true)
    try {
      // Only send fields we expose, that actually changed from the loaded data.
      const patch: Partial<SystemSettings> = {}
      const keys = [...SITE_TEXT, ...DEFAULT_NUM, ...TOGGLES].map((f) => f.key)
      for (const k of keys) {
        if (data && form[k] !== data[k]) patch[k] = form[k]
      }
      if (Object.keys(patch).length === 0) {
        toast.info(t('admin.set.noChanges'))
        return
      }
      await adminSettingsApi.update(patch)
      toast.success(t('admin.set.saved'))
    } catch (e) {
      toast.error((e as ApiError)?.message || 'Error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <VStack gap={6} width="100%" maxWidth={820}>
      <HStack justify="between" vAlign="center">
        <Heading level={2}>{t('admin.settings')}</Heading>
        <Button label={t('common.submit')} variant="primary" isLoading={saving} isDisabled={isLoading} clickAction={save} />
      </HStack>

      <Card padding={6}>
 <VStack gap={4}>
   <Heading level={4}>{t('admin.set.site')}</Heading>
   {SITE_TEXT.map((f) => (
     <TextInput
key={String(f.key)}
label={t(f.labelKey)}
       value={String(form[f.key] ?? '')}
       onChange={(v) => setField(f.key, v as SystemSettings[typeof f.key])}
       width="100%"
     />
   ))}
 </VStack>
      </Card>

      <Card padding={6}>
 <VStack gap={4}>
   <Heading level={4}>{t('admin.set.defaults')}</Heading>
   <HStack gap={4} wrap="wrap">
     {DEFAULT_NUM.map((f) => (
       <TextInput
         key={String(f.key)}
         label={t(f.labelKey)}
         value={String(form[f.key] ?? '')}
         onChange={(v) => setField(f.key, (Number(v) || 0) as SystemSettings[typeof f.key])}
  width={220}
  inputMode="numeric"
       />
            ))}
   </HStack>
        </VStack>
      </Card>

      <Card padding={6}>
        <VStack gap={3}>
          <Heading level={4}>{t('admin.set.features')}</Heading>
   {TOGGLES.map((f) => (
     <HStack key={String(f.key)} justify="between" vAlign="center">
       <Text>{t(f.labelKey)}</Text>
<Switch
         label={t(f.labelKey)}
  value={Boolean(form[f.key])}
         onChange={(checked) => setField(f.key, checked as SystemSettings[typeof f.key])}
       />
     </HStack>
          ))}
        </VStack>
      </Card>
    </VStack>
  )
}
