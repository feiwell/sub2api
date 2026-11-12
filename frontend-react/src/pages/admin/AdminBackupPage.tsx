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
import type { ApiError, BackupRecord } from '@/lib/types'

type BackupRow = BackupRecord & Record<string, unknown>

function fmtDate(v: string | undefined): string {
  if (!v) return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleString()
}

function fmtSize(b: number | undefined): string {
  const n = Number(b ?? 0)
  if (!n) return '—'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`
}

function statusVariant(s: string): 'success' | 'warning' | 'error' | 'neutral' {
  if (s === 'completed') return 'success'
  if (s === 'running' || s === 'pending') return 'warning'
  if (s === 'failed') return 'error'
  return 'neutral'
}

export function AdminBackupPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-backups'],
    queryFn: () => adminApi.listBackups(),
  })

  const createM = useMutation({
    mutationFn: () => adminApi.createBackup(),
    onSuccess: () => {
      toast.success(t('admin.bk.created'))
      void qc.invalidateQueries({ queryKey: ['admin-backups'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const removeM = useMutation({
    mutationFn: (id: string) => adminApi.deleteBackup(id),
    onSuccess: () => {
      toast.success(t('admin.bk.deleted'))
      void qc.invalidateQueries({ queryKey: ['admin-backups'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const rows = useMemo<BackupRow[]>(() => (Array.isArray(data) ? (data as BackupRow[]) : []), [data])

  const columns: TableColumn<BackupRow>[] = [
    { key: 'file_name', header: t('admin.bk.file'), width: proportional(3, { minWidth: 180 }),
      renderCell: (r) => <Text type="code" maxLines={1}>{r.file_name || r.id}</Text> },
    { key: 'backup_type', header: t('admin.bk.type'), width: pixel(120) },
    { key: 'size_bytes', header: t('admin.bk.size'), width: pixel(110),
      renderCell: (r) => <Text hasTabularNumbers>{fmtSize(r.size_bytes)}</Text> },
    {
      key: 'status',
      header: t('keys.status'),
      width: pixel(120),
      renderCell: (r) => <Badge label={String(r.status)} variant={statusVariant(String(r.status))} />,
    },
    { key: 'started_at', header: t('admin.bk.started'), width: pixel(180), renderCell: (r) => <Text>{fmtDate(r.started_at)}</Text> },
    {
      key: 'actions',
      header: '',
      width: pixel(110),
      renderCell: (r) => (
        <Button
   label={t('common.delete')}
          size="sm"
   variant="destructive"
   clickAction={async () => {
     if (typeof window !== 'undefined' && !window.confirm(t('admin.bk.confirmDelete'))) return
     await removeM.mutateAsync(String(r.id))
          }}
        />
      ),
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1200}>
      <HStack justify="between" vAlign="center">
        <Heading level={2}>{t('admin.backup')}</Heading>
 <Button label={t('admin.bk.create')} variant="primary" isLoading={createM.isPending} clickAction={async () => { await createM.mutateAsync() }} />
      </HStack>
      <Card padding={0}>
        <Table<BackupRow> data={rows} columns={columns} idKey="id" density="balanced" hasHover isStriped />
        {isLoading ? <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack> : null}
 {!isLoading && rows.length === 0 ? <VStack padding={5}><Text type="supporting">{t('admin.bk.empty')}</Text></VStack> : null}
      </Card>
    </VStack>
  )
}
