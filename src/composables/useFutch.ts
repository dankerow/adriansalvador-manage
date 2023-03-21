import { UseFetchOptions } from '#app'
import { useAuthStore } from '@/stores/auth'

export default (url: string, options: UseFetchOptions<object> = {}) => {
	const authStore = useAuthStore()
	const config = useRuntimeConfig()

	const fetchOptions = options
	fetchOptions.headers = fetchOptions.headers || {}

	if (authStore.token) fetchOptions.headers.authorization = `Bearer ${authStore.token}`

	return useFetch(url, {
		baseURL: config.public.apiBaseURL,
		...fetchOptions
	})
}
