import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Badge } from '@astryxdesign/core/Badge'
import { Button } from '@astryxdesign/core/Button'
import { Table, pixel, proportional, type TableColumn } from '@astryxdesign/core/Table'
import { adminApi } from '@/lib/adminApi'
import { toast } from '@/lib/toast'
import type { ApiError, PluginInstallation } from '@/lib/types'

type PluginRow = PluginInstallation & Record<string, unknown>

function stateVariant(s: string): 'success' | 'warning' | 'error' | 'neutral' {
  if (s === 'enabled') return 'success'
  if (s === 'starting') return 'warning'
  if (s === 'error' || s === 'incompatible') return 'error'
  return 'neutral'
}

export function AdminPluginsPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-plugins'],
    queryFn: () => adminApi.listPlugins(),
  })

  const toggleM = useMutation({
    mutationFn: ({ id, enable }: { id: number; enable: boolean }) =>
      enable ? adminApi.enablePlugin(id) : adminApi.disablePlugin(id),
    onSuccess: () => {
      toast.success(t('admin.pl.updated'))
      void qc.invalidateQueries({ queryKey: ['admin-plugins'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const removeM = useMutation({
    mutationFn: (id: number) => adminApi.deletePlugin(id),
    onSuccess: () => {
      toast.success(t('admin.pl.deleted'))
      void qc.invalidateQueries({ queryKey: ['admin-plugins'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const rows = useMemo<PluginRow[]>(() => (Array.isArray(data) ? (data as PluginRow[]) : []), [data])

  const columns: TableColumn<PluginRow>[] = [
    { key: 'name', header: t('admin.pl.name'), width: proportional(2, { minWidth: 140 }) },
    { key: 'version', header: t('admin.pl.version'), width: pixel(110) },
    {
      key: 'signature_status',
      header: t('admin.pl.signature'),
      width: pixel(120),
      renderCell: (r) => <Badge label={String(r.signature_status ?? '—')} variant={r.signature_status === 'trusted' ? 'success' : 'warning'} />,
    },
    {
      key: 'state',
      header: t('keys.status'),
      width: pixel(130),
      renderCell: (r) => <Badge label={String(r.state)} variant={stateVariant(String(r.state))} />,
    },
    {
      key: 'actions',
      header: '',
      width: pixel(200),
      renderCell: (r) => (
        <HStack gap={1}>
          <Button
     label={r.state === 'enabled' ? t('keys.disable') : t('keys.enable')}
     size="sm"
     variant="ghost"
     clickAction={() => { void toggleM.mutateAsync({ id: Number(r.id), enable: r.state !== 'enabled' }) }}
          />
          <Button
     label={t('common.delete')}
     size="sm"
            variant="destructive"
     clickAction={async () => {
       if (typeof window !== 'undefined' && !window.confirm(t('admin.pl.confirmDelete'))) return
       await removeM.mutateAsync(Number(r.id))
     }}
          />
        </HStack>
      ),
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1200}>
      <Heading level={2}>{t('admin.plugins')}</Heading>
      <Card padding={0}>
        <Table<PluginRow> data={rows} columns={columns} idKey="id" density="balanced" hasHover isStriped />
 {isLoading ? <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack> : null}
        {!isLoading && rows.length === 0 ? <VStack padding={5}><Text type="supporting">{t('admin.pl.empty')}</Text></VStack> : null}
      </Card>
    </VStack>
  )
}
