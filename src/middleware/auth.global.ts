import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.auth === false) {
    return
  }

  const store = useAuthStore()

  const loginRoutePath = '/auth/login'
  const isLoggedIn = store.isLoggedIn

  if (!isLoggedIn && to.path !== loginRoutePath) {
    return navigateTo(`${loginRoutePath}?redirect=${to.path}`)
  }
})
