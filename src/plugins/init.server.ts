import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useAlbumsStore } from '@/stores/albums'
import { useFilesStore } from '@/stores/files'

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore(nuxtApp.$pinia)
  const settingsStore = useSettingsStore(nuxtApp.$pinia)
  const filesStore = useFilesStore(nuxtApp.$pinia)
  const albumsStore = useAlbumsStore(nuxtApp.$pinia)

  const token = useCookie('token')
  const sidebar = useCookie('sidebar')

  if (token.value) authStore.updateToken(token.value)
  settingsStore.updateSidebar(Boolean(sidebar.value))

  try {
    await Promise.all([
      authStore.verify(),
      filesStore.getFiles({ includeAlbum: true }, { setData: true }),
      albumsStore.getAlbums({}, { setData: true })
    ])
  } catch (e) {
    authStore.logout()
  }
})
