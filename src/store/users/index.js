export const actions = {
	async add({ commit }, data) {
		const user = await this.$axios.$post('api/users', data)

		return user
	},

	async update({ commit }, data) {
		const user = await this.$axios.$patch(`api/users/${data.id}`, data.entry)

		return user
	}
}
