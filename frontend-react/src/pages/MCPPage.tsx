import { useMemo } from 'react'
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
import { mcpApi } from '@/lib/mcpApi'
import { toast } from '@/lib/toast'
import type { ApiError, MCPGrant } from '@/lib/types'

type GrantRow = MCPGrant & Record<string, unknown>

export function MCPPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()

  const config = useQuery({ queryKey: ['mcp-config'], queryFn: () => mcpApi.getConfig() })
  const grants = useQuery({ queryKey: ['mcp-grants'], queryFn: () => mcpApi.listGrants() })

  const revokeM = useMutation({
    mutationFn: (id: string) => mcpApi.revokeGrant(id),
    onSuccess: () => {
      toast.success(t('mcp.revoked'))
      void qc.invalidateQueries({ queryKey: ['mcp-grants'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const rows = useMemo<GrantRow[]>(() => (Array.isArray(grants.data) ? (grants.data as GrantRow[]) : []), [grants.data])

  const columns: TableColumn<GrantRow>[] = [
    { key: 'client_name', header: t('mcp.client'), width: proportional(2, { minWidth: 140 }) },
    { key: 'scope', header: t('mcp.scope'), width: pixel(110) },
    {
      key: 'read_only',
      header: t('mcp.mode'),
      width: pixel(120),
      renderCell: (r) => <Badge label={r.read_only ? t('mcp.readonly') : t('mcp.readwrite')} variant={r.read_only ? 'neutral' : 'blue'} />,
    },
    {
      key: 'status',
      header: t('keys.status'),
      width: pixel(120),
      renderCell: (r) => (
 <Badge
          label={r.revoked_at || r.invalidated ? t('mcp.revokedLabel') : t('mcp.active')}
          variant={r.revoked_at || r.invalidated ? 'error' : 'success'}
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      width: pixel(110),
      renderCell: (r) => (
        <Button
          label={t('mcp.revoke')}
          size="sm"
          variant="destructive"
          isDisabled={!!r.revoked_at || r.invalidated}
          clickAction={async () => {
     if (typeof window !== 'undefined' && !window.confirm(t('mcp.confirmRevoke'))) return
     await revokeM.mutateAsync(String(r.id))
          }}
        />
      ),
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1100}>
      <Heading level={2}>{t('mcp.title')}</Heading>
      <Card padding={6}>
        <VStack gap={2}>
   <Text type="supporting">{t('mcp.endpoint')}</Text>
          <TextInput label={t('mcp.endpoint')} isLabelHidden value={config.data?.resource ?? ''} onChange={() => {}} isReadOnly width="100%" />
        </VStack>
      </Card>
      <Card padding={0}>
        <Table<GrantRow> data={rows} columns={columns} idKey="id" density="balanced" hasHover isStriped />
        {grants.isLoading ? <VStack padding={5}><Text type="supporting">{t('common.loading')}</Text></VStack> : null}
 {!grants.isLoading && rows.length === 0 ? <VStack padding={5}><Text type="supporting">{t('mcp.empty')}</Text></VStack> : null}
      </Card>
    </VStack>
  )
}
