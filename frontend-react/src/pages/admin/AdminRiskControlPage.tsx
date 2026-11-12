import { useEffect, useMemo, useState } from 'react'
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
import { Badge } from '@astryxdesign/core/Badge'
import { Table, pixel, proportional, type TableColumn } from '@astryxdesign/core/Table'
import { adminApi } from '@/lib/adminApi'
import { toast } from '@/lib/toast'
import type { ApiError, ModerationConfig, ModerationLog } from '@/lib/types'

type LogRow = ModerationLog & Record<string, unknown>

function fmtDate(v: string | undefined): string {
  if (!v) return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleString()
}

const TOGGLES: { key: keyof ModerationConfig; labelKey: string }[] = [
  { key: 'enabled', labelKey: 'admin.risk.enabled' },
  { key: 'record_non_hits', labelKey: 'admin.risk.recordNonHits' },
  { key: 'email_on_hit', labelKey: 'admin.risk.emailOnHit' },
  { key: 'auto_ban_enabled', labelKey: 'admin.risk.autoBan' },
]

export function AdminRiskControlPage() {
  const { t } = useTranslation()
  const cfg = useQuery({ queryKey: ['risk-config'], queryFn: () => adminApi.getModerationConfig() })
  const logs = useQuery({ queryKey: ['risk-logs'], queryFn: () => adminApi.listModerationLogs(1, 50) })

  const [form, setForm] = useState<ModerationConfig>({ enabled: false })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (cfg.data) setForm(cfg.data)
  }, [cfg.data])

  function setField<K extends keyof ModerationConfig>(k: K, v: ModerationConfig[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function save() {
    setSaving(true)
    try {
      const patch: Partial<ModerationConfig> = {
        enabled: form.enabled,
 base_url: form.base_url,
 model: form.model,
 record_non_hits: form.record_non_hits,
        email_on_hit: form.email_on_hit,
        auto_ban_enabled: form.auto_ban_enabled,
      }
      await adminApi.updateModerationConfig(patch)
      toast.success(t('admin.risk.saved'))
    } catch (e) {
      toast.error((e as ApiError)?.message || 'Error')
    } finally {
      setSaving(false)
    }
  }

  const rows = useMemo<LogRow[]>(() => (logs.data?.items || []) as LogRow[], [logs.data])

  const columns: TableColumn<LogRow>[] = [
    { key: 'created_at', header: t('admin.al.time'), width: pixel(180), renderCell: (r) => <Text>{fmtDate(r.created_at)}</Text> },
    { key: 'user_id', header: t('admin.sub.user'), width: pixel(90) },
    { key: 'model', header: t('admin.ul.model'), width: proportional(2, { minWidth: 140 }) },
    {
      key: 'action',
      header: t('admin.risk.action'),
      width: pixel(130),
      renderCell: (r) => <Badge label={String(r.action ?? '—')} variant={r.action === 'block' ? 'error' : 'neutral'} />,
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1100}>
      <HStack justify="between" vAlign="center">
        <Heading level={2}>{t('admin.riskControl')}</Heading>
        <Button label={t('common.submit')} variant="primary" isLoading={saving} isDisabled={cfg.isLoading} clickAction={save} />
      </HStack>

      <Card padding={6}>
 <VStack gap={4}>
   <Heading level={4}>{t('admin.risk.config')}</Heading>
   <HStack gap={3} wrap="wrap">
     <TextInput label={t('admin.risk.baseUrl')} value={String(form.base_url ?? '')} onChange={(v) => setField('base_url', v)} width={320} />
     <TextInput label={t('admin.ul.model')} value={String(form.model ?? '')} onChange={(v) => setField('model', v)} width={220} />
   </HStack>
   {TOGGLES.map((tg) => (
     <HStack key={String(tg.key)} justify="between" vAlign="center">
       <Text>{t(tg.labelKey)}</Text>
<Switch label={t(tg.labelKey)} value={Boolean(form[tg.key])} onChange={(c) => setField(tg.key, c as ModerationConfig[typeof tg.key])} />
     </HStack>
   ))}
 </VStack>
      </Card>

      <Card padding={0}>
 <Table<LogRow> data={rows} columns={columns} idKey="id" density="compact" hasHover isStriped />
        {logs.isLoading ? <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack> : null}
 {!logs.isLoading && rows.length === 0 ? <VStack padding={5}><Text type="supporting">{t('admin.risk.noLogs')}</Text></VStack> : null}
      </Card>
    </VStack>
  )
}
