import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { TextArea } from '@astryxdesign/core/TextArea'
import { Button } from '@astryxdesign/core/Button'
import { Badge } from '@astryxdesign/core/Badge'
import { Table, pixel, proportional, type TableColumn } from '@astryxdesign/core/Table'
import { adminAnnouncementsApi } from '@/lib/announcementsApi'
import { toast } from '@/lib/toast'
import type { Announcement, ApiError, PaginatedResponse } from '@/lib/types'

type AnnRow = Announcement & Record<string, unknown>

export function AdminAnnouncementsPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [err, setErr] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: () => adminAnnouncementsApi.list(1, 50),
  })

  const createM = useMutation({
    mutationFn: () => adminAnnouncementsApi.create({ title: title.trim(), content: content.trim(), status: 'published' }),
    onSuccess: () => {
      setTitle('')
      setContent('')
      setErr(null)
      toast.success(t('admin.ann.created'))
      void qc.invalidateQueries({ queryKey: ['admin-announcements'] })
    },
    onError: (e) => setErr((e as unknown as ApiError)?.message || 'Error'),
  })

  const removeM = useMutation({
    mutationFn: (id: number) => adminAnnouncementsApi.remove(id),
    onSuccess: () => {
      toast.success(t('admin.ann.deleted'))
      void qc.invalidateQueries({ queryKey: ['admin-announcements'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const rows = useMemo<AnnRow[]>(() => {
    const d = data as PaginatedResponse<Announcement> | Announcement[] | undefined
    if (Array.isArray(d)) return d as AnnRow[]
    return (d?.items || []) as AnnRow[]
  }, [data])

  const columns: TableColumn<AnnRow>[] = [
    { key: 'id', header: 'ID', width: pixel(70) },
    { key: 'title', header: t('admin.ann.titleCol'), width: proportional(2, { minWidth: 140 }) },
    {
      key: 'status',
      header: t('keys.status'),
      width: pixel(130),
      renderCell: (row) => <Badge label={String(row.status || '')} variant={row.status === 'published' ? 'success' : 'neutral'} />,
    },
    {
      key: 'actions',
      header: '',
      width: pixel(110),
      renderCell: (row) => (
 <Button
   label={t('common.delete')}
   size="sm"
   variant="destructive"
          clickAction={async () => {
     if (typeof window !== 'undefined' && !window.confirm(t('admin.ann.confirmDelete'))) return
     await removeM.mutateAsync(Number(row.id))
          }}
        />
      ),
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1100}>
      <Heading level={2}>{t('admin.announcements')}</Heading>

      <Card padding={6}>
 <VStack gap={4}>
   <Heading level={4}>{t('admin.ann.new')}</Heading>
          <TextInput
     label={t('admin.ann.titleCol')}
     value={title}
     onChange={setTitle}
     width="100%"
     status={err ? { type: 'error', message: err } : undefined}
   />
   <TextArea label={t('admin.ann.content')} value={content} onChange={setContent} width="100%" rows={4} />
          <HStack>
     <Button
       label={t('admin.ann.publish')}
       variant="primary"
       isLoading={createM.isPending}
       isDisabled={!title.trim() || !content.trim()}
clickAction={async () => { await createM.mutateAsync() }}
     />
   </HStack>
        </VStack>
      </Card>

      <Card padding={0}>
 <Table<AnnRow> data={rows} columns={columns} idKey="id" density="balanced" hasHover isStriped />
        {isLoading ? (
   <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack>
        ) : null}
 {!isLoading && rows.length === 0 ? (
   <VStack padding={5}><Text type="supporting">{t('admin.ann.empty')}</Text></VStack>
        ) : null}
      </Card>
    </VStack>
  )
}
