import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { useAppStore } from '@/stores/appStore'
import { setLocale, getLocale } from '@/i18n'

export function HomePage() {
  const { t } = useTranslation()
  const siteName = useAppStore((s) => s.siteName)
  const nextLocale = getLocale().startsWith('zh') ? 'en' : 'zh'

  const features = [
    { titleKey: 'home.f1Title', descKey: 'home.f1Desc' },
    { titleKey: 'home.f2Title', descKey: 'home.f2Desc' },
    { titleKey: 'home.f3Title', descKey: 'home.f3Desc' },
  ]

  return (
    <VStack height="100vh" isScrollable className="bg-background">
      <HStack as="header" vAlign="center" justify="between" paddingInline={6} paddingBlock={4} className="border-b border-subtle bg-surface">
 <Heading level={4}>{siteName || 'Sub2API'}</Heading>
        <HStack gap={2} vAlign="center">
   <Button label={nextLocale === 'zh' ? '中文' : 'EN'} variant="ghost" size="sm" onClick={() => setLocale(nextLocale)} />
   <Button label={t('auth.login')} variant="ghost" size="sm" href="/login" />
   <Button label={t('auth.register')} variant="primary" size="sm" href="/register" />
        </HStack>
      </HStack>

      <VStack gap={8} paddingBlock={10} paddingInline={6} hAlign="center">
 <VStack gap={4} hAlign="center" maxWidth={760}>
          <Heading level={1} type="display-2" justify="center">{t('home.heroTitle')}</Heading>
   <Text type="large" justify="center" color="secondary">{t('home.heroSubtitle')}</Text>
          <HStack gap={3}>
     <Link to="/register" style={{ textDecoration: 'none' }}>
       <Button label={t('home.getStarted')} variant="primary" size="lg" />
     </Link>
     <Link to="/login" style={{ textDecoration: 'none' }}>
       <Button label={t('auth.login')} variant="secondary" size="lg" />
     </Link>
   </HStack>
 </VStack>

 <HStack gap={4} wrap="wrap" justify="center" maxWidth={1000}>
   {features.map((f) => (
     <Card key={f.titleKey} width={300} padding={6}>
       <VStack gap={2}>
  <Heading level={4}>{t(f.titleKey)}</Heading>
  <Text type="supporting">{t(f.descKey)}</Text>
       </VStack>
     </Card>
          ))}
        </HStack>
      </VStack>
    </VStack>
  )
}
