import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { usageApi } from '@/lib/usageApi'
import { useAuthStore } from '@/stores/authStore'
import { TrendChart } from '@/components/TrendChart'

function n(v: unknown): string {
  const x = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(x) ? x.toLocaleString() : '—'
}
function money(v: unknown): string {
  const x = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(x) ? `$${x.toFixed(2)}` : '—'
}

export function DashboardPage() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const name = (user?.display_name as string) || (user?.username as string) || ''

  const stats = useQuery({ queryKey: ['user-dashboard-stats'], queryFn: () => usageApi.getDashboardStats() })
  const trend = useQuery({ queryKey: ['user-dashboard-trend'], queryFn: () => usageApi.getDashboardTrend() })

  const metrics = [
    { labelKey: 'usage.totalRequests', value: n(stats.data?.total_requests) },
    { labelKey: 'usage.totalTokens', value: n(stats.data?.total_tokens) },
    { labelKey: 'usage.totalCost', value: money(stats.data?.total_cost) },
    { labelKey: 'usage.balance', value: money(stats.data?.balance) },
  ]

  const points = trend.data?.trend ?? []

  return (
    <VStack gap={6} width="100%" maxWidth={1100}>
      <VStack gap={1}>
        <Heading level={2}>{t('dashboard.title')}</Heading>
 <Text type="supporting">
   {t('dashboard.welcome')}{name ? `, ${name}` : ''}
        </Text>
      </VStack>

      <HStack gap={4} wrap="wrap">
        {metrics.map((m) => (
   <Card key={m.labelKey} width={240} padding={5}>
            <VStack gap={2}>
       <Text type="supporting">{t(m.labelKey)}</Text>
       <Heading level={3}>{stats.isLoading ? '…' : m.value}</Heading>
     </VStack>
   </Card>
        ))}
      </HStack>

      <Card padding={6}>
 <VStack gap={4}>
   <Heading level={4}>{t('dashboard.trend')}</Heading>
   {trend.isLoading ? (
     <Text type="supporting">{t('common.loading')}</Text>
   ) : points.length === 0 ? (
     <Text type="supporting">{t('dashboard.noTrend')}</Text>
   ) : (
     <TrendChart
       points={points}
       series={[
  { key: 'requests', label: t('usage.totalRequests'), color: '#6741d9' },
         { key: 'cost', label: t('usage.totalCost'), color: '#12b886' },
]}
     />
   )}
 </VStack>
      </Card>
    </VStack>
  )
}
