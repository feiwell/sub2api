import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Badge } from '@astryxdesign/core/Badge'
import { Button } from '@astryxdesign/core/Button'
import { Table, pixel, proportional, type TableColumn } from '@astryxdesign/core/Table'
import { adminApi } from '@/lib/adminApi'
import { toast } from '@/lib/toast'
import type { ApiError, Channel, PaginatedResponse } from '@/lib/types'

type ChRow = Channel & Record<string, unknown>

export function AdminChannelsPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-channels'],
    queryFn: () => adminApi.listChannels(1, 50),
  })

  const removeM = useMutation({
    mutationFn: (id: number) => adminApi.deleteChannel(id),
    onSuccess: () => {
      toast.success(t('admin.ch.deleted'))
      void qc.invalidateQueries({ queryKey: ['admin-channels'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const rows = useMemo<ChRow[]>(() => {
    const d = data as PaginatedResponse<Channel> | Channel[] | undefined
    if (Array.isArray(d)) return d as ChRow[]
    return (d?.items || []) as ChRow[]
  }, [data])

  const columns: TableColumn<ChRow>[] = [
    { key: 'id', header: 'ID', width: pixel(70) },
    { key: 'name', header: t('admin.ch.name'), width: proportional(2, { minWidth: 140 }) },
    { key: 'description', header: t('admin.ch.desc'), width: proportional(3, { minWidth: 160 }) },
    {
      key: 'status',
      header: t('keys.status'),
      width: pixel(120),
      renderCell: (row) => (
 <Badge label={String(row.status ?? '—')} variant={row.status === 'active' ? 'success' : 'neutral'} />
      ),
    },
    {
      key: 'actions',
      header: '',
      width: pixel(110),
      renderCell: (row) => (
        <Button
   label={t('common.delete')}
          size="sm"
   variant="destructive"
   clickAction={async () => {
     if (typeof window !== 'undefined' && !window.confirm(t('admin.ch.confirmDelete'))) return
     await removeM.mutateAsync(Number(row.id))
   }}
        />
      ),
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1200}>
      <Heading level={2}>{t('admin.channels')}</Heading>
      <Card padding={0}>
        <Table<ChRow> data={rows} columns={columns} idKey="id" density="balanced" hasHover isStriped />
        {isLoading ? <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack> : null}
 {!isLoading && rows.length === 0 ? <VStack padding={5}><Text type="supporting">{t('admin.ch.empty')}</Text></VStack> : null}
      </Card>
    </VStack>
  )
}
