export const actions = {
	nuxtServerInit({ dispatch }, { $cookies }) {
		const session = $cookies.get('session')

		if (!session) return dispatch('auth/logout')

		return dispatch('auth/verify')
	}
}
