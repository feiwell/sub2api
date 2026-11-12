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
import { Table, pixel, proportional, type TableColumn } from '@astryxdesign/core/Table'
import { Badge } from '@astryxdesign/core/Badge'
import { keysApi } from '@/lib/keysApi'
import type { ApiError, ApiKey } from '@/lib/types'

type KeyRow = ApiKey & Record<string, unknown>

function maskKey(key: string): string {
  if (!key) return '—'
  if (key.length <= 12) return key
  return `${key.slice(0, 6)}…${key.slice(-4)}`
}

export function KeysPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [newName, setNewName] = useState('')
  const [createErr, setCreateErr] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['keys'],
    queryFn: () => keysApi.list(1, 50),
  })

  const createMutation = useMutation({
    mutationFn: (name: string) => keysApi.create({ name }),
    onSuccess: () => {
      setNewName('')
      setCreateErr(null)
      void qc.invalidateQueries({ queryKey: ['keys'] })
    },
    onError: (e) => setCreateErr((e as unknown as ApiError)?.message || 'Error'),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'inactive' }) =>
      keysApi.toggleStatus(id, status),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['keys'] }),
  })

  const removeMutation = useMutation({
    mutationFn: (id: number) => keysApi.remove(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['keys'] }),
  })

  const rows = useMemo<KeyRow[]>(() => (data?.items || []) as KeyRow[], [data])

  const columns: TableColumn<KeyRow>[] = [
    { key: 'name', header: t('keys.name'), width: proportional(2, { minWidth: 120 }) },
    {
      key: 'key',
      header: t('keys.key'),
      width: proportional(2, { minWidth: 140 }),
      renderCell: (row) => <Text type="code">{maskKey(row.key)}</Text>,
    },
    {
      key: 'status',
      header: t('keys.status'),
      width: pixel(120),
      renderCell: (row) => (
 <Badge
          label={row.status}
   variant={row.status === 'active' ? 'success' : row.status === 'inactive' ? 'neutral' : 'error'}
        />
      ),
    },
    {
      key: 'quota_used',
      header: t('keys.usage'),
      width: pixel(140),
      renderCell: (row) => (
        <Text hasTabularNumbers>
   {`$${(row.quota_used ?? 0).toFixed(2)} / ${row.quota ? `$${row.quota.toFixed(2)}` : '∞'}`}
        </Text>
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
     clickAction={() => { void toggleMutation.mutateAsync({
  id: row.id,
  status: row.status === 'active' ? 'inactive' : 'active',
       }) }}
          />
          <Button
     label={t('common.delete')}
     size="sm"
     variant="destructive"
     clickAction={async () => {
       if (typeof window !== 'undefined' && !window.confirm(t('keys.confirmDelete'))) return
       await removeMutation.mutateAsync(row.id)
     }}
   />
 </HStack>
      ),
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1100}>
      <Heading level={2}>{t('keys.title')}</Heading>

      <Card padding={5}>
        <HStack gap={3} vAlign="end" wrap="wrap">
          <TextInput
     label={t('keys.newKeyName')}
     value={newName}
     onChange={setNewName}
     placeholder="my-app-key"
            width={280}
     onEnter={() => newName.trim() && createMutation.mutate(newName.trim())}
     status={createErr ? { type: 'error', message: createErr } : undefined}
   />
   <Button
     label={t('keys.create')}
     variant="primary"
     isLoading={createMutation.isPending}
     isDisabled={!newName.trim()}
     clickAction={async () => { await createMutation.mutateAsync(newName.trim()) }}
   />
        </HStack>
      </Card>

      <Card padding={0}>
        <Table<KeyRow>
   data={rows}
          columns={columns}
          idKey="id"
   density="balanced"
          hasHover
          isStriped
        />
 {isLoading ? (
          <VStack padding={5}>
     <Text type="supporting">{t('common.loading')}</Text>
   </VStack>
        ) : null}
        {!isLoading && rows.length === 0 ? (
   <VStack padding={5}>
     <Text type="supporting">{t('keys.empty')}</Text>
   </VStack>
        ) : null}
      </Card>
    </VStack>
  )
}
