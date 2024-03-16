<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Adrian Salvador - Dashboard` : 'Adrian Salvador - Dashboard'
  }
})

const colorMode = useColorMode()

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
