<script setup lang="ts">
const colorMode = useColorMode()

useHead({
	title: null,
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} - Adrian Salvador - Dashboard` : 'Adrian Salvador - Dashboard'
	},
	meta: [
		{ name: 'description', content: '' },
		{ name: 'format-detection', content: 'telephone=no' },
		{ name: 'robots', content: 'noydir,noodp,noarchive,nocache,notranslate,nofollow,noimageindex,noindex' }
	],
	link: [
		{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
		{ rel: 'preconnect', href: 'https://cdn.salvadoradrian.com' },
		{ rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' }
	],
	script: [
		{
			src: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0-alpha1/js/bootstrap.bundle.min.js',
			type: 'text/javascript',
			defer: true
		}
	]
})

onMounted(() => {
	const setTheme = function(theme: string) {
		document.documentElement.setAttribute('data-bs-theme', theme)
	}
	setTheme(colorMode.value)
})
</script>

<template>
	<div>
		<slot />
	</div>
</template>
