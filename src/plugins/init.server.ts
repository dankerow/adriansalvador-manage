import { useAuthStore } from '@/stores/auth'
import { useAlbumsStore } from '@/stores/albums'
import { useSettingsStore } from '@/stores/settings'

export default defineNuxtPlugin(async (nuxtApp) => {
	const authStore = useAuthStore(nuxtApp.$pinia)
	const albumsStore = useAlbumsStore(nuxtApp.$pinia)
	const settingsStore = useSettingsStore(nuxtApp.$pinia)

	const token = useCookie('token')
	const sidebar = useCookie('sidebar')

	if (token.value) authStore.updateToken(token.value)
	settingsStore.updateSideBar(Boolean(sidebar.value) ?? false)

	try {
		await Promise.all([
			authStore.verify(),
			albumsStore.getAlbums()
		])
	} catch (e) {
		authStore.logout()
	}
})
