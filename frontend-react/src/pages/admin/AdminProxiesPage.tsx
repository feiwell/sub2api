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
import type { ApiError, Proxy } from '@/lib/types'

type ProxyRow = Proxy & Record<string, unknown>

export function AdminProxiesPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [protocol, setProtocol] = useState('http')
  const [host, setHost] = useState('')
  const [port, setPort] = useState('')
  const [err, setErr] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-proxies'],
    queryFn: () => adminApi.listProxies(),
  })

  const createM = useMutation({
    mutationFn: () =>
      adminApi.createProxy({
 name: name.trim(),
 protocol: protocol.trim() || 'http',
        host: host.trim(),
        port: Number(port) || 0,
      }),
    onSuccess: () => {
      setName('')
      setHost('')
      setPort('')
      setErr(null)
      toast.success(t('admin.px.created'))
      void qc.invalidateQueries({ queryKey: ['admin-proxies'] })
    },
    onError: (e) => setErr((e as unknown as ApiError)?.message || 'Error'),
  })

  const toggleM = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'inactive' }) =>
      adminApi.toggleProxyStatus(id, status),
    onSuccess: () => {
      toast.success(t('admin.px.updated'))
      void qc.invalidateQueries({ queryKey: ['admin-proxies'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const removeM = useMutation({
    mutationFn: (id: number) => adminApi.deleteProxy(id),
    onSuccess: () => {
      toast.success(t('admin.px.deleted'))
      void qc.invalidateQueries({ queryKey: ['admin-proxies'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const rows = useMemo<ProxyRow[]>(() => (Array.isArray(data) ? (data as ProxyRow[]) : []), [data])

  const columns: TableColumn<ProxyRow>[] = [
    { key: 'id', header: 'ID', width: pixel(70) },
    { key: 'name', header: t('admin.px.name'), width: proportional(2, { minWidth: 120 }) },
    {
      key: 'endpoint',
      header: t('admin.px.endpoint'),
      width: proportional(3, { minWidth: 180 }),
      renderCell: (row) => <Text type="code" maxLines={1}>{`${row.protocol}://${row.host}:${row.port}`}</Text>,
    },
    {
      key: 'status',
      header: t('keys.status'),
      width: pixel(120),
      renderCell: (row) => (
 <Badge label={String(row.status ?? '—')} variant={row.status === 'active' ? 'success' : row.status === 'expired' ? 'error' : 'neutral'} />
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
       if (typeof window !== 'undefined' && !window.confirm(t('admin.px.confirmDelete'))) return
       await removeM.mutateAsync(Number(row.id))
     }}
   />
        </HStack>
      ),
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1200}>
      <Heading level={2}>{t('admin.proxies')}</Heading>
      <Card padding={5}>
 <VStack gap={3}>
   <Heading level={4}>{t('admin.px.new')}</Heading>
   <HStack gap={3} vAlign="end" wrap="wrap">
     <TextInput label={t('admin.px.name')} value={name} onChange={setName} width={180} />
     <TextInput label={t('admin.px.protocol')} value={protocol} onChange={setProtocol} width={120} placeholder="http" />
     <TextInput label={t('admin.px.host')} value={host} onChange={setHost} width={200} placeholder="1.2.3.4" />
     <TextInput label={t('admin.px.port')} value={port} onChange={setPort} width={110} inputMode="numeric" placeholder="8080" />
     <Button
       label={t('admin.px.create')}
       variant="primary"
       isLoading={createM.isPending}
       isDisabled={!name.trim() || !host.trim() || !port.trim()}
clickAction={async () => { await createM.mutateAsync() }}
     />
   </HStack>
   {err ? <Text color="accent">{err}</Text> : null}
        </VStack>
      </Card>
      <Card padding={0}>
        <Table<ProxyRow> data={rows} columns={columns} idKey="id" density="balanced" hasHover isStriped />
        {isLoading ? <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack> : null}
 {!isLoading && rows.length === 0 ? <VStack padding={5}><Text type="supporting">{t('admin.px.empty')}</Text></VStack> : null}
      </Card>
    </VStack>
  )
}
