import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { Switch } from '@astryxdesign/core/Switch'
import { Button } from '@astryxdesign/core/Button'
import { Badge } from '@astryxdesign/core/Badge'
import { setupApi, type DatabaseConfig, type RedisConfig } from '@/lib/setupApi'
import { toast } from '@/lib/toast'
import type { ApiError } from '@/lib/types'

type TestState = 'idle' | 'ok' | 'fail'

export function SetupPage() {
  const { t } = useTranslation()

  const [db, setDb] = useState<DatabaseConfig>({ host: '127.0.0.1', port: 5432, user: 'postgres', password: '', dbname: 'sub2api', sslmode: 'disable' })
  const [redis, setRedis] = useState<RedisConfig>({ host: '127.0.0.1', port: 6379, username: '', password: '', db: 0, enable_tls: false })
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

  const [dbTest, setDbTest] = useState<TestState>('idle')
  const [redisTest, setRedisTest] = useState<TestState>('idle')
  const [installing, setInstalling] = useState(false)
  const [done, setDone] = useState(false)

  function dbField<K extends keyof DatabaseConfig>(k: K, v: DatabaseConfig[K]) {
    setDb((s) => ({ ...s, [k]: v }))
    setDbTest('idle')
  }
  function redisField<K extends keyof RedisConfig>(k: K, v: RedisConfig[K]) {
    setRedis((s) => ({ ...s, [k]: v }))
    setRedisTest('idle')
  }

  async function testDb() {
    try {
      await setupApi.testDatabase(db)
      setDbTest('ok')
      toast.success(t('setup.dbOk'))
    } catch (e) {
      setDbTest('fail')
      toast.error((e as unknown as ApiError)?.message || t('setup.dbFail'))
    }
  }

  async function testRedis() {
    try {
      await setupApi.testRedis(redis)
      setRedisTest('ok')
      toast.success(t('setup.redisOk'))
    } catch (e) {
      setRedisTest('fail')
      toast.error((e as unknown as ApiError)?.message || t('setup.redisFail'))
    }
  }

  async function install() {
    setInstalling(true)
    try {
      const res = await setupApi.install({
 database: db,
        redis,
        admin: { email: adminEmail.trim(), password: adminPassword },
        server: { host: '0.0.0.0', port: 8080, mode: 'release' },
      })
      setDone(true)
      toast.success(res.message || t('setup.installed'))
    } catch (e) {
      toast.error((e as unknown as ApiError)?.message || t('setup.installFail'))
    } finally {
      setInstalling(false)
    }
  }

  function testBadge(state: TestState) {
    if (state === 'ok') return <Badge label={t('setup.connected')} variant="success" />
    if (state === 'fail') return <Badge label={t('setup.failed')} variant="error" />
    return null
  }

  if (done) {
    return (
      <VStack height="100vh" vAlign="center" hAlign="center" padding={4} className="bg-background">
        <Card width={520} padding={8}>
          <VStack gap={4} hAlign="center">
     <Heading level={2}>{t('setup.doneTitle')}</Heading>
     <Text type="supporting">{t('setup.doneHint')}</Text>
     <Button label={t('auth.login')} variant="primary" href="/login" />
   </VStack>
 </Card>
      </VStack>
    )
  }

  const canInstall = dbTest === 'ok' && !!adminEmail.trim() && adminPassword.length >= 6

  return (
    <VStack isScrollable height="100vh" padding={6} gap={6} hAlign="center" className="bg-background">
      <VStack gap={2} maxWidth={720} width="100%">
 <Heading level={1} type="display-3">{t('setup.title')}</Heading>
 <Text type="supporting">{t('setup.subtitle')}</Text>
      </VStack>

      <Card width="100%" maxWidth={720} padding={6}>
        <VStack gap={4}>
          <HStack justify="between" vAlign="center">
     <Heading level={4}>{t('setup.database')}</Heading>
     {testBadge(dbTest)}
   </HStack>
   <HStack gap={3} wrap="wrap">
     <TextInput label={t('setup.host')} value={db.host} onChange={(v) => dbField('host', v)} width={220} />
     <TextInput label={t('setup.port')} value={String(db.port)} onChange={(v) => dbField('port', Number(v) || 0)} width={110} inputMode="numeric" />
     <TextInput label={t('setup.user')} value={db.user} onChange={(v) => dbField('user', v)} width={160} />
   </HStack>
   <HStack gap={3} wrap="wrap">
     <TextInput type="password" label={t('setup.password')} value={db.password} onChange={(v) => dbField('password', v)} width={220} />
     <TextInput label={t('setup.dbName')} value={db.dbname} onChange={(v) => dbField('dbname', v)} width={160} />
     <TextInput label={t('setup.sslmode')} value={db.sslmode} onChange={(v) => dbField('sslmode', v)} width={140} />
   </HStack>
   <HStack>
     <Button label={t('setup.testDb')} variant="secondary" clickAction={testDb} />
   </HStack>
        </VStack>
      </Card>

      <Card width="100%" maxWidth={720} padding={6}>
 <VStack gap={4}>
   <HStack justify="between" vAlign="center">
     <Heading level={4}>{t('setup.redis')}</Heading>
     {testBadge(redisTest)}
   </HStack>
   <HStack gap={3} wrap="wrap">
     <TextInput label={t('setup.host')} value={redis.host} onChange={(v) => redisField('host', v)} width={220} />
     <TextInput label={t('setup.port')} value={String(redis.port)} onChange={(v) => redisField('port', Number(v) || 0)} width={110} inputMode="numeric" />
     <TextInput type="password" label={t('setup.password')} value={redis.password} onChange={(v) => redisField('password', v)} width={220} />
   </HStack>
   <HStack gap={4} vAlign="center">
     <HStack gap={2} vAlign="center"><Text>{t('setup.tls')}</Text><Switch label={t('setup.tls')} value={redis.enable_tls} onChange={(c) => redisField('enable_tls', c)} /></HStack>
     <Button label={t('setup.testRedis')} variant="secondary" clickAction={testRedis} />
   </HStack>
        </VStack>
      </Card>

      <Card width="100%" maxWidth={720} padding={6}>
        <VStack gap={4}>
   <Heading level={4}>{t('setup.admin')}</Heading>
   <TextInput type="email" label={t('auth.email')} value={adminEmail} onChange={setAdminEmail} width="100%" />
   <TextInput type="password" label={t('setup.adminPassword')} value={adminPassword} onChange={setAdminPassword} width="100%" description={t('setup.pwdHint')} />
 </VStack>
      </Card>

      <VStack width="100%" maxWidth={720}>
        <Button label={t('setup.install')} variant="primary" width="100%" isLoading={installing} isDisabled={!canInstall} clickAction={install} />
      </VStack>
    </VStack>
  )
}
