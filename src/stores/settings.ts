import type { Ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const	sidebar: Ref<boolean> = ref(false)

  const isSidebarPinned = computed(() => sidebar.value)

  const	toggleSidebar = () => {
    sidebar.value = !sidebar.value

    const sidebarCookie = useCookie('sidebar')
    sidebarCookie.value = String(sidebar.value)
  }

  const updateSidebar = (newSidebar: boolean) => {
    sidebar.value = newSidebar
  }

  return {
    sidebar,
    isSidebarPinned,
    toggleSidebar,
    updateSidebar
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
