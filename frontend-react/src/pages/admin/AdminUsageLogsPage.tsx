import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Table, pixel, proportional, type TableColumn } from '@astryxdesign/core/Table'
import { adminApi } from '@/lib/adminApi'
import type { AdminUsageLog, PaginatedResponse } from '@/lib/types'

type LogRow = AdminUsageLog & Record<string, unknown>

function fmtDate(v: string | undefined): string {
  if (!v) return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleString()
}

export function AdminUsageLogsPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-usage-logs'],
    queryFn: () => adminApi.listUsageLogs(1, 50),
  })

  const rows = useMemo<LogRow[]>(() => {
    const d = data as PaginatedResponse<AdminUsageLog> | AdminUsageLog[] | undefined
    if (Array.isArray(d)) return d as LogRow[]
    return (d?.items || []) as LogRow[]
  }, [data])

  const columns: TableColumn<LogRow>[] = [
    { key: 'created_at', header: t('admin.ul.time'), width: pixel(180), renderCell: (r) => <Text>{fmtDate(r.created_at)}</Text> },
    { key: 'user_id', header: t('admin.ul.user'), width: pixel(90) },
    { key: 'model', header: t('admin.ul.model'), width: proportional(2, { minWidth: 160 }) },
    {
      key: 'tokens',
      header: t('admin.ul.tokens'),
      width: pixel(160),
      renderCell: (r) => (
        <Text hasTabularNumbers>{`${Number(r.input_tokens ?? 0)} / ${Number(r.output_tokens ?? 0)}`}</Text>
      ),
    },
    {
      key: 'total_cost',
      header: t('admin.ul.cost'),
      width: pixel(110),
      renderCell: (r) => <Text hasTabularNumbers>{`$${Number(r.total_cost ?? 0).toFixed(4)}`}</Text>,
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1200}>
      <Heading level={2}>{t('admin.usage')}</Heading>
      <Card padding={0}>
 <Table<LogRow> data={rows} columns={columns} idKey="id" density="compact" hasHover isStriped />
        {isLoading ? <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack> : null}
 {!isLoading && rows.length === 0 ? <VStack padding={5}><Text type="supporting">{t('admin.ul.empty')}</Text></VStack> : null}
      </Card>
    </VStack>
  )
}
