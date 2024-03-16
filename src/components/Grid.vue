<script setup lang="ts">
defineProps<{
  items: any[]
}>()
</script>

<template>
  <div>
    <div class="row row-cols-sm-2 row-cols-lg-5 g-4 mb-4">
      <div v-for="(item, index) in items" :key="index" class="col">
        <slot :item="item" />
      </div>
    </div>
  </div>
</template>
