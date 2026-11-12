import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { useAuthStore } from '@/stores/authStore'

interface Metric {
  labelKey: string
  value: string
}

const METRICS: Metric[] = [
  { labelKey: 'nav.keys', value: '—' },
  { labelKey: 'nav.usage', value: '—' },
  { labelKey: 'nav.profile', value: '—' },
]

export function DashboardPage() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const name = (user?.display_name as string) || (user?.username as string) || ''

  return (
    <VStack gap={6} width="100%" maxWidth={1100}>
      <VStack gap={1}>
 <Heading level={2}>{t('dashboard.title')}</Heading>
        <Text type="supporting">
   {t('dashboard.welcome')}{name ? `, ${name}` : ''}
        </Text>
      </VStack>

      <HStack gap={4} wrap="wrap">
        {METRICS.map((m) => (
   <Card key={m.labelKey} width={260} padding={5}>
     <VStack gap={2}>
       <Text type="supporting">{t(m.labelKey)}</Text>
       <Heading level={3}>{m.value}</Heading>
            </VStack>
          </Card>
        ))}
      </HStack>
    </VStack>
  )
}
