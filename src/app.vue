<script setup lang="ts">
useScriptNpm({
  packageName: 'bootstrap',
  file: 'dist/js/bootstrap.min.js',
  version: '5.3.2',
  scriptOptions: {
    bundle: true
  }
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="repeating-linear-gradient(to right,var(--bs-primary) 0%,var(--bs-primary) 100%)" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
