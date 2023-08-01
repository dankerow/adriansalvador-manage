import type { Toast } from '@/types/toast'

export const useToasts = () => useState<Toast[]>('toasts', () => [])

export const useToast = () => {
  const toasts = useToasts()

  const addToast = (toast: Toast) => {
    toasts.value.push(toast)
  }

  const removeToast = (toast: Toast) => {
    const index = toasts.value.indexOf(toast)
    if (index > -1) toasts.value.splice(index, 1)
  }

  return {
    addToast,
    removeToast
  }
}
