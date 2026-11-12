import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { usageApi } from '@/lib/usageApi'

function fmtNum(v: unknown): string {
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString()
}

function fmtMoney(v: unknown): string {
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(n)) return '—'
  return `$${n.toFixed(2)}`
}

export function UsagePage() {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['usage-dashboard'],
    queryFn: () => usageApi.getDashboardStats(),
  })

  const metrics = [
    { labelKey: 'usage.totalRequests', value: fmtNum(data?.total_requests) },
    { labelKey: 'usage.totalTokens', value: fmtNum(data?.total_tokens) },
    { labelKey: 'usage.totalCost', value: fmtMoney(data?.total_cost) },
    { labelKey: 'usage.balance', value: fmtMoney(data?.balance) },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1100}>
      <Heading level={2}>{t('usage.title')}</Heading>
      {isError ? <Text color="accent">{t('usage.unavailable')}</Text> : null}
      <HStack gap={4} wrap="wrap">
        {metrics.map((m) => (
   <Card key={m.labelKey} width={240} padding={5}>
            <VStack gap={2}>
       <Text type="supporting">{t(m.labelKey)}</Text>
       <Heading level={3}>{isLoading ? '…' : m.value}</Heading>
     </VStack>
          </Card>
 ))}
      </HStack>
    </VStack>
  )
}
