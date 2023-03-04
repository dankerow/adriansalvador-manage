export default defineNuxtPlugin(() => {
	const colorMode = useColorMode()

	useHead({
		meta: [{
			id: 'theme-color',
			name: 'theme-color',
			content: () => colorMode.value === 'dark' ? '#1b1b1b' : '#ffffff'
		}]
	})
})
