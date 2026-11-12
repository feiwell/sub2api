// Framework-agnostic toast emitter. A bridge component (ToastBridge) registers
// Astryx's useToast() function here so non-component code (query mutations,
// stores) can raise toasts via toast.info / toast.error.
type ToastType = 'info' | 'error'
type ShowToast = (opts: { body: string; type?: ToastType; uniqueID?: string }) => void

let showFn: ShowToast | null = null
const queue: { body: string; type?: ToastType; uniqueID?: string }[] = []

export function registerToast(fn: ShowToast | null): void {
  showFn = fn
  if (fn) {
    while (queue.length) {
      const item = queue.shift()
      if (item) fn(item)
    }
  }
}

function emit(body: string, type: ToastType): void {
  const payload = { body, type }
  if (showFn) showFn(payload)
  else queue.push(payload)
}

export const toast = {
  info: (body: string) => emit(body, 'info'),
  success: (body: string) => emit(body, 'info'),
  error: (body: string) => emit(body, 'error'),
}
