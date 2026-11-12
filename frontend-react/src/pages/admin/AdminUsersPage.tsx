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
import type { AdminUser } from '@/lib/types'

type UserRow = AdminUser & Record<string, unknown>

export function AdminUsersPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => adminApi.listUsers(1, 50, search ? { search } : undefined),
  })

  const toggle = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'disabled' }) =>
      adminApi.toggleUserStatus(id, status),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const rows = useMemo<UserRow[]>(() => (data?.items || []) as UserRow[], [data])

  const columns: TableColumn<UserRow>[] = [
    { key: 'id', header: 'ID', width: pixel(70) },
    { key: 'username', header: t('auth.username'), width: proportional(2, { minWidth: 120 }) },
    { key: 'email', header: t('auth.email'), width: proportional(3, { minWidth: 160 }) },
    {
      key: 'role',
      header: t('profile.role'),
      width: pixel(110),
      renderCell: (row) => (
 <Badge label={String(row.role || 'user')} variant={row.role === 'admin' ? 'purple' : 'neutral'} />
      ),
    },
    {
      key: 'status',
      header: t('keys.status'),
      width: pixel(120),
      renderCell: (row) => (
        <Badge
   label={String(row.status || 'active')}
          variant={row.status === 'disabled' ? 'error' : 'success'}
 />
      ),
    },
    {
      key: 'balance',
      header: t('usage.balance'),
      width: pixel(120),
      renderCell: (row) => <Text hasTabularNumbers>{`$${Number(row.balance ?? 0).toFixed(2)}`}</Text>,
    },
    {
      key: 'actions',
      header: '',
      width: pixel(130),
      renderCell: (row) => (
        <Button
   label={row.status === 'disabled' ? t('keys.enable') : t('keys.disable')}
   size="sm"
   variant="ghost"
          clickAction={() => {
     void toggle.mutateAsync({
       id: Number(row.id),
       status: row.status === 'disabled' ? 'active' : 'disabled',
     })
          }}
        />
      ),
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1200}>
      <Heading level={2}>{t('admin.users')}</Heading>
      <Card padding={5}>
        <HStack gap={3} vAlign="end" wrap="wrap">
          <TextInput
     label={t('admin.searchUsers')}
     value={searchInput}
     onChange={setSearchInput}
     placeholder="email / username"
     width={300}
     onEnter={() => setSearch(searchInput.trim())}
     hasClear
   />
   <Button label={t('admin.search')} variant="primary" clickAction={async () => setSearch(searchInput.trim())} />
        </HStack>
      </Card>
      <Card padding={0}>
 <Table<UserRow> data={rows} columns={columns} idKey="id" density="balanced" hasHover isStriped />
        {isLoading ? (
          <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack>
        ) : null}
        {!isLoading && rows.length === 0 ? (
   <VStack padding={5}><Text type="supporting">{t('admin.noUsers')}</Text></VStack>
        ) : null}
      </Card>
    </VStack>
  )
}
