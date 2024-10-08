import type { User } from '@/types/user'

import { useAlbumsStore } from '@/stores/albums'
import { useFilesStore } from '@/stores/files'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isLoggedIn = computed(() => {
    return !!user.value
  })

  const verify = async () => {
    try {
      const data = await useFaetch<User>('/authentication/verify')
      if (!data && !isLoggedIn) return logout()

      user.value = data

      const filesStore = useFilesStore()
      const albumsStore = useAlbumsStore()

      if (!filesStore.isPopulated) {
        await filesStore.getFiles({ includeAlbum: true }, { setData: true })
      }

      if (!albumsStore.isPopulated) {
        await albumsStore.getAlbums({}, { setData: true })
      }

      return { error: null }
    } catch (e) {
      return { error: e.data ? e.data.error : e }
    }
  }

  const login = async ({ email, password }: { email: string, password: string }) => {
    try {
      const data = await useFaetch<{ user: User, token: string }>('/authentication/login', {
        method: 'post',
        body: { email, password }
      })

      token.value = data.token
      user.value = data.user

      const tokenCookie = useCookie<string>('token')
      tokenCookie.value = data.token

      return { error: null }
    } catch (e) {
      return { error: e.data ? e.data.error : e }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null

    const tokenCookie = useCookie<string>('token')
    tokenCookie.value = ''
  }

  const updateUser = async (newUser: User) => {
    try {
      const data = await useFaetch<User>('/@me', {
        method: 'put',
        body: newUser
      })
      user.value = data

      return { data, error: null }
    } catch (e) {
      return { error: e.data ? e.data.error : e }
    }
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
    updateToken,
    updateUser
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
