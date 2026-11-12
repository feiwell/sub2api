import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Badge } from '@astryxdesign/core/Badge'
import { Table, pixel, proportional, type TableColumn } from '@astryxdesign/core/Table'
import { paymentApi } from '@/lib/paymentApi'
import type { PaymentOrder, PaginatedResponse } from '@/lib/types'

type OrderRow = PaymentOrder & Record<string, unknown>

function fmtDate(v: string | undefined): string {
  if (!v) return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleString()
}

function statusVariant(s: string): 'success' | 'neutral' | 'error' | 'warning' {
  if (s === 'paid' || s === 'completed' || s === 'success') return 'success'
  if (s === 'pending' || s === 'processing') return 'warning'
  if (s === 'failed' || s === 'cancelled' || s === 'expired') return 'error'
  return 'neutral'
}

export function OrdersPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => paymentApi.getMyOrders(1, 50),
  })

  const rows = useMemo<OrderRow[]>(() => {
    const d = data as PaginatedResponse<PaymentOrder> | PaymentOrder[] | undefined
    if (Array.isArray(d)) return d as OrderRow[]
    return (d?.items || []) as OrderRow[]
  }, [data])

  const columns: TableColumn<OrderRow>[] = [
    { key: 'out_trade_no', header: t('orders.no'), width: proportional(3, { minWidth: 180 }),
      renderCell: (row) => <Text type="code" maxLines={1}>{row.out_trade_no}</Text> },
    { key: 'amount', header: t('orders.amount'), width: pixel(120),
      renderCell: (row) => <Text hasTabularNumbers>{`$${Number(row.amount ?? 0).toFixed(2)}`}</Text> },
    { key: 'payment_type', header: t('orders.method'), width: pixel(130) },
    {
      key: 'status',
      header: t('keys.status'),
      width: pixel(130),
      renderCell: (row) => <Badge label={String(row.status)} variant={statusVariant(String(row.status))} />,
    },
    { key: 'created_at', header: t('orders.createdAt'), width: pixel(180),
      renderCell: (row) => <Text>{fmtDate(row.created_at)}</Text> },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1100}>
      <Heading level={2}>{t('orders.title')}</Heading>
      <Card padding={0}>
        <Table<OrderRow> data={rows} columns={columns} idKey="id" density="balanced" hasHover isStriped />
        {isLoading ? <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack> : null}
 {!isLoading && rows.length === 0 ? <VStack padding={5}><Text type="supporting">{t('orders.empty')}</Text></VStack> : null}
      </Card>
    </VStack>
  )
}
