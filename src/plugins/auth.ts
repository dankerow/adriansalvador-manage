import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore(nuxtApp.$pinia)

  const visibilityHandler = async () => {
    if (authStore.isLoggedIn && document.visibilityState === 'visible') {
      const { error } = await authStore.verify()

      if (error) {
        authStore.logout()

        return navigateTo('/auth/login')
      }
    }
  }

  nuxtApp.hook('app:mounted', () => {
    document.addEventListener('visibilitychange', visibilityHandler, false)
  })

  const _unmount = nuxtApp.vueApp.unmount
  nuxtApp.vueApp.unmount = async function() {
    document.removeEventListener('visibilitychange', visibilityHandler, false)

    await authStore.logout()

    _unmount()
  }
})
