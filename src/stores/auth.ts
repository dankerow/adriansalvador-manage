import { defineStore } from 'pinia'
import type { Ref } from 'vue'

interface User {
	id: string
	username: string
	email: string
	createdAt: string
	updatedAt: string
}

export interface AuthState {
	user: User|null
	token: string|null
}

export const useAuthStore = defineStore('auth', () => {
	const user: Ref<AuthState['user']> = ref(null)
	const token: Ref<AuthState['token']> = ref(null)

	const isLoggedIn = computed(() => {
		return !!user.value
	})

	const verify = async () => {
		try {
			const data: AuthState['user'] = await useFaetch('/authentication/verify')
			if (!data && !isLoggedIn) return logout()

			user.value = data
		} catch (e: any) {
			return { error: e.data.error ? e.data.error : e }
		}
	}

	const login = async ({ email, password }: { email: string, password: string }) => {
		try {
			const data: AuthState = await useFaetch('/authentication/login', { method: 'post', body: { email, password } })

			token.value = data.token
			user.value = data.user

			const tokenCookie = useCookie('token')
			tokenCookie.value = data.token
		} catch (e: any) {
			return { error: e.data.error ? e.data.error : e }
		}
	}

	const logout = () => {
		user.value = null
		token.value = null

		const tokenCookie = useCookie('token')
		tokenCookie.value = null
	}

	const updateToken = (newToken: string) => {
		token.value = newToken
	}

	return {
		user,
		token,
		isLoggedIn,
		verify,
		login,
		logout,
		updateToken
	}
})
