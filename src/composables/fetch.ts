import type { Ref } from 'vue'
import type { UseFetchOptions } from '#app'
import type { NitroFetchOptions } from 'nitropack'
import defu from 'defu'

export const withLoadingState = async (loading: Ref<boolean>, fetchFn: () => Promise<any>) => {
  try {
    loading.value = true
    const result = await fetchFn()
    return result
  } catch (e: any) {
    throw e.data ? e.data.error : e
  } finally {
    loading.value = false
  }
}

export const useFaetch = <T>(url: string, options: NitroFetchOptions<Request> = {}): Promise<T> => {
  const userAuth = useCookie('token')
  const config = useRuntimeConfig()

  const defaults: NitroFetchOptions<Request> = {
    baseURL: config.public.apiBaseURL,
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
    baseURL: config.public.apiBaseURL,
    headers: userAuth.value
      ? { Authorization: `Bearer ${userAuth.value}` }
      : {}
  }

  const params = defu(options, defaults)

  return useFetch(url, params)
}
