import { useEffect } from 'react'
import { useToast } from '@astryxdesign/core/Toast'
import { registerToast } from '@/lib/toast'

/**
 * Bridges Astryx's useToast() hook to the module-level toast emitter so any code
 * (mutations, interceptors) can raise toasts. Must render inside <Providers>.
 */
export function ToastBridge() {
  const showToast = useToast()
  useEffect(() => {
    registerToast((opts) => {
      showToast({ body: opts.body, type: opts.type ?? 'info', uniqueID: opts.uniqueID })
    })
    return () => registerToast(null)
  }, [showToast])
  return null
}
