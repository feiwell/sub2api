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
import type { ApiError, ChannelMonitor, PaginatedResponse } from '@/lib/types'

type MonitorRow = ChannelMonitor & Record<string, unknown>

export function AdminChannelMonitorPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-monitors'],
    queryFn: () => adminApi.listChannelMonitors(1, 50),
  })

  const runM = useMutation({
    mutationFn: (id: number) => adminApi.runChannelMonitor(id),
    onSuccess: () => {
      toast.success(t('admin.cm.triggered'))
      void qc.invalidateQueries({ queryKey: ['admin-monitors'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const removeM = useMutation({
    mutationFn: (id: number) => adminApi.deleteChannelMonitor(id),
    onSuccess: () => {
      toast.success(t('admin.cm.deleted'))
      void qc.invalidateQueries({ queryKey: ['admin-monitors'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const rows = useMemo<MonitorRow[]>(() => {
    const d = data as PaginatedResponse<ChannelMonitor> | ChannelMonitor[] | undefined
    if (Array.isArray(d)) return d as MonitorRow[]
    return (d?.items || []) as MonitorRow[]
  }, [data])

  const columns: TableColumn<MonitorRow>[] = [
    { key: 'name', header: t('admin.cm.name'), width: proportional(2, { minWidth: 140 }) },
    { key: 'provider', header: t('admin.cm.provider'), width: pixel(120) },
    { key: 'primary_model', header: t('admin.cm.model'), width: proportional(2, { minWidth: 140 }) },
    {
      key: 'enabled',
      header: t('keys.status'),
      width: pixel(120),
      renderCell: (r) => <Badge label={r.enabled ? t('mcp.active') : t('keys.disable')} variant={r.enabled ? 'success' : 'neutral'} />,
    },
    {
      key: 'actions',
      header: '',
      width: pixel(190),
      renderCell: (r) => (
        <HStack gap={1}>
          <Button
     label={t('admin.cm.run')}
     size="sm"
     variant="ghost"
     clickAction={() => { void runM.mutateAsync(Number(r.id)) }}
          />
          <Button
     label={t('common.delete')}
     size="sm"
     variant="destructive"
     clickAction={async () => {
       if (typeof window !== 'undefined' && !window.confirm(t('admin.cm.confirmDelete'))) return
       await removeM.mutateAsync(Number(r.id))
     }}
          />
 </HStack>
      ),
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1200}>
      <Heading level={2}>{t('admin.channelMonitor')}</Heading>
      <Card padding={0}>
        <Table<MonitorRow> data={rows} columns={columns} idKey="id" density="balanced" hasHover isStriped />
 {isLoading ? <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack> : null}
        {!isLoading && rows.length === 0 ? <VStack padding={5}><Text type="supporting">{t('admin.cm.empty')}</Text></VStack> : null}
      </Card>
    </VStack>
  )
}
