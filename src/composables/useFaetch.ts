import type { FetchOptions } from 'ofetch'
import { useAuthStore } from '@/stores/auth'

export default <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  const fetchOptions = options
  fetchOptions.headers = fetchOptions.headers || {}

  if (authStore.token) fetchOptions.headers.authorization = `Bearer ${authStore.token}`

  return $fetch(url, {
    baseURL: config.public.apiBaseURL,
    ...fetchOptions
  })
}
