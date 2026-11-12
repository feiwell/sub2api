import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { Button } from '@astryxdesign/core/Button'
import { Badge } from '@astryxdesign/core/Badge'
import { Table, pixel, proportional, type TableColumn } from '@astryxdesign/core/Table'
import { adminApi } from '@/lib/adminApi'
import { toast } from '@/lib/toast'
import type { ApiError, RedeemCode, PaginatedResponse } from '@/lib/types'

type CodeRow = RedeemCode & Record<string, unknown>

export function AdminRedeemCodesPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [count, setCount] = useState('10')
  const [value, setValue] = useState('10')
  const [type, setType] = useState('balance')
  const [err, setErr] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-redeem'],
    queryFn: () => adminApi.listRedeemCodes(1, 50),
  })

  const genM = useMutation({
    mutationFn: () =>
      adminApi.generateRedeemCodes({
        count: Number(count) || 1,
        type: type.trim() || 'balance',
        value: Number(value) || 0,
      }),
    onSuccess: (codes) => {
      setErr(null)
      toast.success(t('admin.rc.generated', { n: Array.isArray(codes) ? codes.length : 0 }))
      void qc.invalidateQueries({ queryKey: ['admin-redeem'] })
    },
    onError: (e) => setErr((e as unknown as ApiError)?.message || 'Error'),
  })

  const removeM = useMutation({
    mutationFn: (id: number) => adminApi.deleteRedeemCode(id),
    onSuccess: () => {
      toast.success(t('admin.rc.deleted'))
      void qc.invalidateQueries({ queryKey: ['admin-redeem'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const rows = useMemo<CodeRow[]>(() => {
    const d = data as PaginatedResponse<RedeemCode> | RedeemCode[] | undefined
    if (Array.isArray(d)) return d as CodeRow[]
    return (d?.items || []) as CodeRow[]
  }, [data])

  const columns: TableColumn<CodeRow>[] = [
    { key: 'code', header: t('admin.rc.code'), width: proportional(3, { minWidth: 180 }),
      renderCell: (r) => <Text type="code" maxLines={1}>{r.code}</Text> },
    { key: 'type', header: t('admin.rc.type'), width: pixel(130) },
    { key: 'value', header: t('admin.rc.value'), width: pixel(110),
      renderCell: (r) => <Text hasTabularNumbers>{String(r.value)}</Text> },
    {
      key: 'status',
      header: t('keys.status'),
      width: pixel(120),
      renderCell: (r) => (
 <Badge
          label={String(r.status)}
          variant={r.status === 'used' ? 'neutral' : r.status === 'expired' || r.status === 'disabled' ? 'error' : 'success'}
        />
      ),
    },
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
            if (typeof window !== 'undefined' && !window.confirm(t('admin.rc.confirmDelete'))) return
     await removeM.mutateAsync(Number(r.id))
          }}
        />
      ),
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1200}>
      <Heading level={2}>{t('admin.redeemCodes')}</Heading>
      <Card padding={5}>
        <VStack gap={3}>
          <Heading level={4}>{t('admin.rc.generate')}</Heading>
          <HStack gap={3} vAlign="end" wrap="wrap">
     <TextInput label={t('admin.rc.count')} value={count} onChange={setCount} width={120} inputMode="numeric" />
            <TextInput label={t('admin.rc.type')} value={type} onChange={setType} width={160} placeholder="balance" />
     <TextInput label={t('admin.rc.value')} value={value} onChange={setValue} width={120} inputMode="numeric" />
            <Button
       label={t('admin.rc.generate')}
       variant="primary"
       isLoading={genM.isPending}
       clickAction={async () => { await genM.mutateAsync() }}
     />
   </HStack>
   {err ? <Text color="accent">{err}</Text> : null}
 </VStack>
      </Card>
      <Card padding={0}>
        <Table<CodeRow> data={rows} columns={columns} idKey="id" density="balanced" hasHover isStriped />
        {isLoading ? <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack> : null}
        {!isLoading && rows.length === 0 ? <VStack padding={5}><Text type="supporting">{t('admin.rc.empty')}</Text></VStack> : null}
      </Card>
    </VStack>
  )
}
