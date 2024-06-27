<script setup lang="ts">
withDefaults(defineProps<{
  items: never[]
  columns: number
}>(), {
  columns: 5
})
</script>

<template>
  <div>
    <div :class="`row row-cols-1 row-cols-sm-2 row-cols-lg-${columns} g-4 mb-4`">
      <div v-for="(item, index) in items" :key="index" class="col">
        <slot :item="item" />
      </div>
    </div>
  </div>
</template>
