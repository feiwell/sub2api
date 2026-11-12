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
import type { AdminGroup, ApiError } from '@/lib/types'

type GroupRow = AdminGroup & Record<string, unknown>

export function AdminGroupsPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [err, setErr] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-groups'],
    queryFn: () => adminApi.listGroups(),
  })

  const createM = useMutation({
    mutationFn: () => adminApi.createGroup({ name: name.trim() }),
    onSuccess: () => {
      setName('')
      setErr(null)
      toast.success(t('admin.grp.created'))
      void qc.invalidateQueries({ queryKey: ['admin-groups'] })
    },
    onError: (e) => setErr((e as unknown as ApiError)?.message || 'Error'),
  })

  const toggleM = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'inactive' }) =>
      adminApi.toggleGroupStatus(id, status),
    onSuccess: () => {
      toast.success(t('admin.grp.updated'))
      void qc.invalidateQueries({ queryKey: ['admin-groups'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const removeM = useMutation({
    mutationFn: (id: number) => adminApi.deleteGroup(id),
    onSuccess: () => {
      toast.success(t('admin.grp.deleted'))
      void qc.invalidateQueries({ queryKey: ['admin-groups'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const rows = useMemo<GroupRow[]>(() => (Array.isArray(data) ? (data as GroupRow[]) : []), [data])

  const columns: TableColumn<GroupRow>[] = [
    { key: 'id', header: 'ID', width: pixel(70) },
    { key: 'name', header: t('admin.grp.name'), width: proportional(2, { minWidth: 140 }) },
    { key: 'platform', header: t('admin.grp.platform'), width: pixel(120) },
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
       if (typeof window !== 'undefined' && !window.confirm(t('admin.grp.confirmDelete'))) return
       await removeM.mutateAsync(Number(row.id))
     }}
          />
        </HStack>
      ),
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1200}>
      <Heading level={2}>{t('admin.groups')}</Heading>
      <Card padding={5}>
        <HStack gap={3} vAlign="end" wrap="wrap">
          <TextInput
     label={t('admin.grp.newName')}
     value={name}
     onChange={setName}
            width={280}
     onEnter={() => name.trim() && createM.mutate()}
     status={err ? { type: 'error', message: err } : undefined}
   />
   <Button
     label={t('admin.grp.create')}
     variant="primary"
     isLoading={createM.isPending}
     isDisabled={!name.trim()}
     clickAction={async () => { await createM.mutateAsync() }}
          />
        </HStack>
      </Card>
      <Card padding={0}>
        <Table<GroupRow> data={rows} columns={columns} idKey="id" density="balanced" hasHover isStriped />
        {isLoading ? <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack> : null}
 {!isLoading && rows.length === 0 ? <VStack padding={5}><Text type="supporting">{t('admin.grp.empty')}</Text></VStack> : null}
      </Card>
    </VStack>
  )
}
