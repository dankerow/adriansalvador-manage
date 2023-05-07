export const useToasts = () => useState<object[]>('toasts', () => [])

export const useToast = () => {
  const toasts = useToasts()

  const addToast = (toast: object) => {
    toasts.value.push(toast)
  }

  const removeToast = (toast: object) => {
    const index = toasts.value.indexOf(toast)
    if (index > -1) toasts.value.splice(index, 1)
  }

  return {
    addToast,
    removeToast
  }
}
