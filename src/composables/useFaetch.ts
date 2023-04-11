import { useAuthStore } from '@/stores/auth'
import { NitroFetchOptions } from 'nitropack'

export default <T>(url: string, options: NitroFetchOptions<Request> = {}): Promise<T> => {
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
