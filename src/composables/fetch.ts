import type { UseFetchOptions } from '#app'
import type { NitroFetchOptions } from 'nitropack'

import defu from 'defu'

export const useFaetch = <T>(url: string, options: NitroFetchOptions<Request> = {}): Promise<T> => {
  const userAuth = useCookie('token')
  const config = useRuntimeConfig()

  const defaults: NitroFetchOptions<Request> = {
    baseURL: config.public.apiBaseUrl,
    credentials: 'include',
    headers: userAuth.value
      ? { Authorization: `Bearer ${userAuth.value}` }
      : {}
  }

  const params = defu(options, defaults)

  return $fetch(url, params)
}

export const useFutch = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  const userAuth = useCookie('token')
  const config = useRuntimeConfig()

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.apiBaseUrl,
    credentials: 'include',
    headers: userAuth.value
      ? { Authorization: `Bearer ${userAuth.value}` }
      : {}
  }

  const params = defu(options, defaults)

  return useFetch(url, params)
}
