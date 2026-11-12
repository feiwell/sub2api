import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Badge } from '@astryxdesign/core/Badge'
import { Table, pixel, proportional, type TableColumn } from '@astryxdesign/core/Table'
import { subscriptionsApi } from '@/lib/subscriptionsApi'
import type { UserSubscription } from '@/lib/types'

type SubRow = UserSubscription & Record<string, unknown>

function fmtDate(v: string | null | undefined): string {
  if (!v) return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString()
}

export function SubscriptionsPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => subscriptionsApi.getMine(),
  })

  const rows = useMemo<SubRow[]>(() => (Array.isArray(data) ? (data as SubRow[]) : []), [data])

  const columns: TableColumn<SubRow>[] = [
    { key: 'id', header: 'ID', width: pixel(70) },
    {
      key: 'group',
      header: t('subscriptions.group'),
      width: proportional(2, { minWidth: 120 }),
      renderCell: (row) => <Text>{(row.group?.name as string) || `#${row.group_id}`}</Text>,
    },
    {
      key: 'status',
      header: t('keys.status'),
      width: pixel(120),
      renderCell: (row) => (
 <Badge
   label={String(row.status)}
   variant={row.status === 'active' ? 'success' : row.status === 'expired' ? 'neutral' : 'error'}
        />
      ),
    },
    {
      key: 'monthly_usage_usd',
      header: t('subscriptions.monthlyUsage'),
      width: pixel(150),
      renderCell: (row) => <Text hasTabularNumbers>{`$${Number(row.monthly_usage_usd ?? 0).toFixed(2)}`}</Text>,
    },
    {
      key: 'expires_at',
      header: t('subscriptions.expiresAt'),
      width: pixel(140),
      renderCell: (row) => <Text>{fmtDate(row.expires_at)}</Text>,
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1100}>
      <Heading level={2}>{t('subscriptions.title')}</Heading>
      <Card padding={0}>
        <Table<SubRow> data={rows} columns={columns} idKey="id" density="balanced" hasHover isStriped />
 {isLoading ? (
          <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack>
 ) : null}
        {!isLoading && rows.length === 0 ? (
          <VStack padding={5}><Text type="supporting">{t('subscriptions.empty')}</Text></VStack>
        ) : null}
      </Card>
    </VStack>
  )
}
