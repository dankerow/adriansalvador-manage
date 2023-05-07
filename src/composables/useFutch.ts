import { UseFetchOptions } from '#app'
import defu from 'defu'

export default <T>(url: string, options: UseFetchOptions<T> = {}) => {
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
