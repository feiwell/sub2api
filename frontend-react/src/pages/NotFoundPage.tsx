import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Button } from '@astryxdesign/core/Button'

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <VStack height="100vh" vAlign="center" hAlign="center" gap={4} className="bg-background">
      <Heading level={1} type="display-2">404</Heading>
      <Text type="large">{t('notFound.title')}</Text>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button label={t('notFound.back')} variant="primary" />
      </Link>
    </VStack>
  )
}
