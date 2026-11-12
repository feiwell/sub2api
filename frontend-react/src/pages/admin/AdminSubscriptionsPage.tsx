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
import type { ApiError, UserSubscription, PaginatedResponse } from '@/lib/types'

type SubRow = UserSubscription & Record<string, unknown>

function fmtDate(v: string | null | undefined): string {
  if (!v) return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString()
}

export function AdminSubscriptionsPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: () => adminApi.listSubscriptions(1, 50),
  })

  const revokeM = useMutation({
    mutationFn: (id: number) => adminApi.revokeSubscription(id),
    onSuccess: () => {
      toast.success(t('admin.sub.revoked'))
      void qc.invalidateQueries({ queryKey: ['admin-subscriptions'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const rows = useMemo<SubRow[]>(() => {
    const d = data as PaginatedResponse<UserSubscription> | UserSubscription[] | undefined
    if (Array.isArray(d)) return d as SubRow[]
    return (d?.items || []) as SubRow[]
  }, [data])

  const columns: TableColumn<SubRow>[] = [
    { key: 'id', header: 'ID', width: pixel(70) },
    { key: 'user_id', header: t('admin.sub.user'), width: pixel(90) },
    {
      key: 'group',
      header: t('subscriptions.group'),
      width: proportional(2, { minWidth: 120 }),
      renderCell: (r) => <Text>{(r.group?.name as string) || `#${r.group_id}`}</Text>,
    },
    {
      key: 'status',
      header: t('keys.status'),
      width: pixel(120),
      renderCell: (r) => (
 <Badge label={String(r.status)} variant={r.status === 'active' ? 'success' : r.status === 'expired' ? 'neutral' : 'error'} />
      ),
    },
    { key: 'expires_at', header: t('subscriptions.expiresAt'), width: pixel(140), renderCell: (r) => <Text>{fmtDate(r.expires_at)}</Text> },
    {
      key: 'actions',
      header: '',
      width: pixel(110),
      renderCell: (r) => (
 <Button
   label={t('admin.sub.revoke')}
   size="sm"
   variant="destructive"
          isDisabled={r.status !== 'active'}
   clickAction={async () => {
     if (typeof window !== 'undefined' && !window.confirm(t('admin.sub.confirmRevoke'))) return
     await revokeM.mutateAsync(Number(r.id))
   }}
 />
      ),
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1200}>
      <Heading level={2}>{t('admin.subscriptions')}</Heading>
      <Card padding={0}>
 <Table<SubRow> data={rows} columns={columns} idKey="id" density="balanced" hasHover isStriped />
        {isLoading ? <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack> : null}
 {!isLoading && rows.length === 0 ? <VStack padding={5}><Text type="supporting">{t('admin.sub.empty')}</Text></VStack> : null}
      </Card>
    </VStack>
  )
}
