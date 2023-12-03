import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.meta.auth === false) {
    return
  }

  const authStore = useAuthStore()
  const loginRoutePath = '/auth/login'

  await authStore.verify()

  if (!authStore.isLoggedIn && to.path !== loginRoutePath) {
    return navigateTo(`${loginRoutePath}?redirect=${to.path !== '/' ? to.path : '/dashboard'}`)
  }

  if (to.path === '/') {
    return navigateTo('/dashboard')
  }
})
