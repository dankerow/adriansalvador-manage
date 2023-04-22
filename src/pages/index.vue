<script setup lang="ts">
definePageMeta({
  layout: 'none',
  middleware: [
    function () {
      return navigateTo('/dashboard')
    }
  ]
})
</script>

<template>
  <div />
</template>
