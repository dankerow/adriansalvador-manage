<script setup lang="ts">
const colorMode = useColorMode()
const changeTheme = () => {
	const theme = colorMode.value === 'dark' ? 'light' : 'dark'
	document.documentElement.setAttribute('data-bs-theme', theme)
	colorMode.preference = theme
}
</script>

<template>
	<div class="color-mode" @click="changeTheme">
		<Icon :name="`ic:twotone-${colorMode.value === 'dark' ? 'brightness-7' : 'brightness-3'}`" />
	</div>
</template>

<style lang="scss" scoped>
.color-mode {
	align-items: center;
	border-radius: 0.25rem;
	cursor: pointer;
	display: flex;
	justify-content: center;
	padding: 0.4rem;
	width: max-content;

	svg {
		height: 1.25rem;
		width: auto;
	}
}
</style>
