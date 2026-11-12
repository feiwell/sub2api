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
import type { Account, ApiError, PaginatedResponse } from '@/lib/types'

type AccRow = Account & Record<string, unknown>

export function AdminAccountsPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-accounts'],
    queryFn: () => adminApi.listAccounts(1, 50),
  })

  const toggleM = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'inactive' }) =>
      adminApi.toggleAccountStatus(id, status),
    onSuccess: () => {
      toast.success(t('admin.acc.updated'))
      void qc.invalidateQueries({ queryKey: ['admin-accounts'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const removeM = useMutation({
    mutationFn: (id: number) => adminApi.deleteAccount(id),
    onSuccess: () => {
      toast.success(t('admin.acc.deleted'))
      void qc.invalidateQueries({ queryKey: ['admin-accounts'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const rows = useMemo<AccRow[]>(() => {
    const d = data as PaginatedResponse<Account> | Account[] | undefined
    if (Array.isArray(d)) return d as AccRow[]
    return (d?.items || []) as AccRow[]
  }, [data])

  const columns: TableColumn<AccRow>[] = [
    { key: 'id', header: 'ID', width: pixel(70) },
    { key: 'name', header: t('admin.acc.name'), width: proportional(2, { minWidth: 140 }) },
    { key: 'platform', header: t('admin.acc.platform'), width: pixel(130) },
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
      width: pixel(190),
      renderCell: (row) => (
 <HStack gap={1}>
   <Button
     label={row.status === 'active' ? t('keys.disable') : t('keys.enable')}
     size="sm"
     variant="ghost"
     clickAction={() => {
       void toggleM.mutateAsync({ id: Number(row.id), status: row.status === 'active' ? 'inactive' : 'active' })
     }}
   />
   <Button
     label={t('common.delete')}
            size="sm"
     variant="destructive"
     clickAction={async () => {
       if (typeof window !== 'undefined' && !window.confirm(t('admin.acc.confirmDelete'))) return
       await removeM.mutateAsync(Number(row.id))
     }}
   />
        </HStack>
      ),
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1200}>
      <Heading level={2}>{t('admin.accounts')}</Heading>
      <Card padding={0}>
 <Table<AccRow> data={rows} columns={columns} idKey="id" density="balanced" hasHover isStriped />
        {isLoading ? <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack> : null}
 {!isLoading && rows.length === 0 ? <VStack padding={5}><Text type="supporting">{t('admin.acc.empty')}</Text></VStack> : null}
      </Card>
    </VStack>
  )
}
