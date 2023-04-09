import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const store = useAuthStore()

  if (store.isLoggedIn && store.user?.role !== 'admin') {
    return navigateTo('/auth/login')
  }
})
