export const actions = {
	async add({ commit }, data) {
		const album = await this.$axios.$post('api/albums', data)

		return album
	},

	async update({ commit }, data) {
		const album = await this.$axios.$patch(`api/albums/${data.id}`, data.entry)

		return album
	}
}
