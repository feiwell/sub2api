import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Badge } from '@astryxdesign/core/Badge'
import { Table, pixel, proportional, type TableColumn } from '@astryxdesign/core/Table'
import { adminApi } from '@/lib/adminApi'
import type { AuditLog, PaginatedResponse } from '@/lib/types'

type LogRow = AuditLog & Record<string, unknown>

function fmtDate(v: string | undefined): string {
  if (!v) return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleString()
}

function codeVariant(c: number): 'success' | 'warning' | 'error' | 'neutral' {
  if (!c) return 'neutral'
  if (c >= 500) return 'error'
  if (c >= 400) return 'warning'
  if (c >= 200 && c < 300) return 'success'
  return 'neutral'
}

export function AdminAuditLogPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit'],
    queryFn: () => adminApi.listAuditLogs(1, 50),
  })

  const rows = useMemo<LogRow[]>(() => {
    const d = data as PaginatedResponse<AuditLog> | AuditLog[] | undefined
    if (Array.isArray(d)) return d as LogRow[]
    return (d?.items || []) as LogRow[]
  }, [data])

  const columns: TableColumn<LogRow>[] = [
    { key: 'created_at', header: t('admin.al.time'), width: pixel(180), renderCell: (r) => <Text>{fmtDate(r.created_at)}</Text> },
    { key: 'actor_email', header: t('admin.al.actor'), width: proportional(2, { minWidth: 160 }) },
    { key: 'action', header: t('admin.al.action'), width: proportional(2, { minWidth: 140 }) },
    {
      key: 'path',
      header: t('admin.al.path'),
      width: proportional(3, { minWidth: 160 }),
      renderCell: (r) => <Text type="code" maxLines={1}>{`${r.method || ''} ${r.path || ''}`}</Text>,
    },
    {
      key: 'status_code',
      header: t('admin.al.code'),
      width: pixel(100),
      renderCell: (r) => <Badge label={String(r.status_code ?? '—')} variant={codeVariant(Number(r.status_code))} />,
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1200}>
      <Heading level={2}>{t('admin.auditLog')}</Heading>
      <Card padding={0}>
        <Table<LogRow> data={rows} columns={columns} idKey="id" density="compact" hasHover isStriped />
        {isLoading ? <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack> : null}
        {!isLoading && rows.length === 0 ? <VStack padding={5}><Text type="supporting">{t('admin.al.empty')}</Text></VStack> : null}
      </Card>
    </VStack>
  )
}
