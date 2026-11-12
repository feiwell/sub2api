import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { Button } from '@astryxdesign/core/Button'
import { redeemApi } from '@/lib/redeemApi'
import { toast } from '@/lib/toast'
import type { ApiError } from '@/lib/types'

export function RedeemPage() {
  const { t } = useTranslation()
  const [code, setCode] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function submit() {
    setErr(null)
    setResult(null)
    setLoading(true)
    try {
      const res = await redeemApi.redeem(code.trim())
      setResult(res.message || t('redeem.success'))
      setCode('')
      toast.success(res.message || t('redeem.success'))
    } catch (e) {
      const msg = (e as ApiError)?.message || 'Error'
      setErr(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <VStack gap={6} width="100%" maxWidth={560}>
      <Heading level={2}>{t('redeem.title')}</Heading>
      <Card padding={6}>
        <VStack gap={4}>
          <Text type="supporting">{t('redeem.hint')}</Text>
          <TextInput
     label={t('redeem.code')}
     value={code}
     onChange={setCode}
     placeholder="XXXX-XXXX-XXXX"
     width="100%"
     onEnter={submit}
     status={err ? { type: 'error', message: err } : undefined}
   />
   {result ? <Text color="accent">{result}</Text> : null}
   <HStack>
     <Button
       label={t('redeem.submit')}
       variant="primary"
       isLoading={loading}
       isDisabled={!code.trim()}
       clickAction={submit}
     />
   </HStack>
 </VStack>
      </Card>
    </VStack>
  )
}
