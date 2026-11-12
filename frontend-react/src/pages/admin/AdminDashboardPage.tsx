import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { adminApi } from '@/lib/adminApi'
import { TrendChart } from '@/components/TrendChart'

function n(v: unknown): string {
  const x = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(x) ? x.toLocaleString() : '—'
}
function money(v: unknown): string {
  const x = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(x) ? `$${x.toFixed(2)}` : '—'
}

export function AdminDashboardPage() {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboardStats(),
  })
  const trend = useQuery({ queryKey: ['admin-dashboard-trend'], queryFn: () => adminApi.getDashboardTrend() })

  const groups = [
    {
      titleKey: 'admin.stat.users',
      items: [
 { labelKey: 'admin.stat.totalUsers', value: n(data?.total_users) },
 { labelKey: 'admin.stat.todayNewUsers', value: n(data?.today_new_users) },
 { labelKey: 'admin.stat.activeUsers', value: n(data?.active_users) },
      ],
    },
    {
      titleKey: 'admin.stat.keysAccounts',
      items: [
        { labelKey: 'admin.stat.totalKeys', value: n(data?.total_api_keys) },
 { labelKey: 'admin.stat.totalAccounts', value: n(data?.total_accounts) },
        { labelKey: 'admin.stat.errorAccounts', value: n(data?.error_accounts) },
      ],
    },
    {
      titleKey: 'admin.stat.traffic',
      items: [
 { labelKey: 'admin.stat.totalRequests', value: n(data?.total_requests) },
 { labelKey: 'admin.stat.todayRequests', value: n(data?.today_requests) },
        { labelKey: 'admin.stat.totalCost', value: money(data?.total_cost) },
      ],
    },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={1200}>
      <Heading level={2}>{t('admin.dashboard')}</Heading>
      {isError ? <Text color="accent">{t('usage.unavailable')}</Text> : null}
      {groups.map((g) => (
 <VStack key={g.titleKey} gap={3}>
   <Heading level={4}>{t(g.titleKey)}</Heading>
   <HStack gap={4} wrap="wrap">
     {g.items.map((it) => (
<Card key={it.labelKey} width={240} padding={5}>
         <VStack gap={2}>
    <Text type="supporting">{t(it.labelKey)}</Text>
    <Heading level={3}>{isLoading ? '…' : it.value}</Heading>
  </VStack>
       </Card>
     ))}
   </HStack>
        </VStack>
      ))}
      <Card padding={6}>
        <VStack gap={4}>
   <Heading level={4}>{t('dashboard.trend')}</Heading>
   {trend.isLoading ? (
     <Text type="supporting">{t('common.loading')}</Text>
          ) : (trend.data?.trend?.length ?? 0) === 0 ? (
     <Text type="supporting">{t('dashboard.noTrend')}</Text>
   ) : (
     <TrendChart
       points={trend.data!.trend}
       series={[
         { key: 'requests', label: t('admin.stat.totalRequests'), color: '#6741d9' },
         { key: 'cost', label: t('admin.stat.totalCost'), color: '#12b886' },
       ]}
     />
   )}
        </VStack>
      </Card>
    </VStack>
  )
}
