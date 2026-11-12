import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Badge } from '@astryxdesign/core/Badge'
import { modelPlazaApi } from '@/lib/modelPlazaApi'

export function ModelPlazaPage() {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['model-plaza'],
    queryFn: () => modelPlazaApi.get(),
  })

  const groups = data?.groups ?? []

  return (
    <VStack gap={6} width="100%" maxWidth={1200}>
      <Heading level={2}>{t('plaza.title')}</Heading>
      {isLoading ? <Text type="supporting">{t('common.loading')}</Text> : null}
      {isError ? <Text color="accent">{t('plaza.unavailable')}</Text> : null}
      {!isLoading && !isError && groups.length === 0 ? (
        <Text type="supporting">{t('plaza.empty')}</Text>
      ) : null}

      <HStack gap={4} wrap="wrap">
        {groups.map((g) => (
   <Card key={g.id} width={360} padding={6}>
     <VStack gap={3}>
       <HStack justify="between" vAlign="center">
         <Heading level={4}>{g.name}</Heading>
  <Badge label={g.platform} variant="blue" />
       </HStack>
       {g.description ? <Text type="supporting">{g.description}</Text> : null}
       <VStack gap={1}>
  {(g.models || []).slice(0, 12).map((m) => (
    <HStack key={m.name} justify="between" vAlign="center">
      <Text type="code" maxLines={1}>{m.name}</Text>
      <Text type="supporting">{m.platform}</Text>
    </HStack>
  ))}
  {(g.models || []).length > 12 ? (
    <Text type="supporting">{t('plaza.more', { n: g.models.length - 12 })}</Text>
         ) : null}
</VStack>
     </VStack>
   </Card>
        ))}
      </HStack>
    </VStack>
  )
}
