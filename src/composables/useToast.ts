export interface ToastItem {
  id: number
  title: string
  description?: string
  type?: 'info' | 'success' | 'error'
  duration?: number
}

let toastId = 0

export const useToast = () => {
  const toasts = useState<ToastItem[]>('toasts', () => [])

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = ++toastId
    const normalizedToast: ToastItem = {
      id,
      type: 'info',
      duration: 3000,
      ...toast,
    }

    toasts.value = [...toasts.value, normalizedToast]

    if (normalizedToast.duration && normalizedToast.duration > 0) {
      setTimeout(() => {
        dismissToast(id)
      }, normalizedToast.duration)
    }

    return id
  }

  const dismissToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  return {
    toasts,
    addToast,
    dismissToast,
  }
}
