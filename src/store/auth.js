export const state = () => ({
	loggedIn: false,
	user: null,
	token: null
})

export const mutations = {
	// eslint-disable-next-line no-shadow
	SET_TOKEN(state, token) {
		state.token = token
	},
	// eslint-disable-next-line no-shadow
	SET_USER(state, user) {
		state.user = user
		state.loggedIn = true
	},
	// eslint-disable-next-line no-shadow
	DESTROY_USER(state) {
		state.user = null
		state.loggedIn = false
	}
}

export const actions = {
	async verify({ commit, dispatch }) {
		try {
			const user = await this.$axios.$get('/api/authentication/verify')
			if (!user) commit('DESTROY_USER')

			commit('SET_USER', user)
		} catch (e) {
			dispatch('logout')

			return e
		}
	},
	async login({ commit }, { email, password }) {
		try {
			const { token, user } = await this.$axios.$post('/api/authentication/login', { email, password })

			this.$cookies.set('session', { token }, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7
			})

			this.$axios.setToken(token, 'Bearer')

			commit('SET_TOKEN', token)
			commit('SET_USER', user)
		} catch (e) {
			return e
		}
	},
	logout({ commit }) {
		this.$cookies.remove('session')
		commit('DESTROY_USER')
	}
}
