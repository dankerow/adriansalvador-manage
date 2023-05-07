import { NitroFetchOptions } from 'nitropack'
import defu from 'defu'

export default <T>(url: string, options: NitroFetchOptions<Request> = {}): Promise<T> => {
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
