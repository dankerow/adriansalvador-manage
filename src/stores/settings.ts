import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
	const	sideBar: Ref<boolean> = ref(false)

	const isSideBarPinned = computed(() => sideBar.value)

	const	toggleSideBar = () => {
		sideBar.value = !sideBar.value

		const sidebarCookie = useCookie('sidebar')
		sidebarCookie.value = String(sideBar.value)
	}

	const updateSideBar = (newSideBar: boolean) => {
		sideBar.value = newSideBar
	}

	return {
		sideBar,
		isSideBarPinned,
		toggleSideBar,
		updateSideBar
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
