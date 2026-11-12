import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Button } from '@astryxdesign/core/Button'

/**
 * Placeholder for the first-run setup wizard. The multi-step DB/Redis/install
 * flow (ported from Vue SetupWizardView) lands in a later migration phase.
 */
export function SetupPage() {
  const { t } = useTranslation()
  return (
    <VStack height="100vh" vAlign="center" hAlign="center" padding={4} className="bg-background">
      <Card width={520} padding={8}>
 <VStack gap={4}>
   <Heading level={2}>{t('setup.title')}</Heading>
          <Text type="supporting">{t('setup.pending')}</Text>
          <Button label={t('setup.retry')} variant="primary" href="/login" />
        </VStack>
      </Card>
    </VStack>
  )
}
