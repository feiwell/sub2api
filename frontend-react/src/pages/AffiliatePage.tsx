import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VStack } from '@astryxdesign/core/VStack'
import { HStack } from '@astryxdesign/core/HStack'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { Button } from '@astryxdesign/core/Button'
import { affiliateApi } from '@/lib/affiliateApi'
import { toast } from '@/lib/toast'
import type { ApiError } from '@/lib/types'

export function AffiliatePage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['affiliate'], queryFn: () => affiliateApi.getDetail() })

  const transferM = useMutation({
    mutationFn: () => affiliateApi.transfer(),
    onSuccess: (res) => {
      toast.success(t('affiliate.transferred', { n: res.transferred_quota }))
      void qc.invalidateQueries({ queryKey: ['affiliate'] })
    },
    onError: (e) => toast.error((e as unknown as ApiError)?.message || 'Error'),
  })

  const link = data?.aff_code
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/register?aff=${data.aff_code}`
    : ''

  const metrics = [
    { labelKey: 'affiliate.invitees', value: String(data?.aff_count ?? '—') },
    { labelKey: 'affiliate.quota', value: `$${Number(data?.aff_quota ?? 0).toFixed(2)}` },
    { labelKey: 'affiliate.frozen', value: `$${Number(data?.aff_frozen_quota ?? 0).toFixed(2)}` },
    { labelKey: 'affiliate.history', value: `$${Number(data?.aff_history_quota ?? 0).toFixed(2)}` },
  ]

  return (
    <VStack gap={6} width="100%" maxWidth={900}>
      <Heading level={2}>{t('affiliate.title')}</Heading>

      <Card padding={6}>
        <VStack gap={4}>
          <Heading level={4}>{t('affiliate.yourLink')}</Heading>
   <HStack gap={3} vAlign="end" wrap="wrap">
     <TextInput label={t('affiliate.code')} value={data?.aff_code ?? ''} onChange={() => {}} isReadOnly width={200} />
     <TextInput label={t('affiliate.link')} value={link} onChange={() => {}} isReadOnly width="100%" hasClear={false} />
   </HStack>
   <HStack>
     <Button
label={t('affiliate.copy')}
       variant="secondary"
isDisabled={!link}
       clickAction={async () => {
  try {
    await navigator.clipboard.writeText(link)
    toast.success(t('affiliate.copied'))
  } catch {
    toast.error('Clipboard unavailable')
  }
       }}
     />
   </HStack>
        </VStack>
      </Card>

      <HStack gap={4} wrap="wrap">
 {metrics.map((m) => (
          <Card key={m.labelKey} width={200} padding={5}>
     <VStack gap={2}>
<Text type="supporting">{t(m.labelKey)}</Text>
       <Heading level={3}>{isLoading ? '…' : m.value}</Heading>
     </VStack>
   </Card>
        ))}
      </HStack>

      <Card padding={6}>
 <HStack justify="between" vAlign="center">
   <VStack gap={1}>
     <Heading level={4}>{t('affiliate.transferTitle')}</Heading>
     <Text type="supporting">{t('affiliate.transferHint')}</Text>
   </VStack>
   <Button
     label={t('affiliate.transfer')}
     variant="primary"
     isLoading={transferM.isPending}
     isDisabled={!data || Number(data.aff_quota) <= 0}
     clickAction={async () => { await transferM.mutateAsync() }}
   />
        </HStack>
      </Card>
    </VStack>
  )
}
