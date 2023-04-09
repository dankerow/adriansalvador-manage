<script setup lang="ts">
interface Props {
  itemCount: number;
  columns: object[];
}

withDefaults(defineProps<Props>(), {
  itemCount: 0,
  columns: () => []
})

const colorMode = useColorMode()
</script>

<template>
  <div class="table-responsive">
    <table
      id="table-loading"
      class="table table-hover align-items-center"
      :class="{ 'table-light': colorMode.value === 'light', 'table-dark': colorMode.value === 'dark' }"
    >
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.prop" scope="col">
            {{ column.label }}
          </th>
        </tr>
      </thead>

      <tbody class="list">
        <tr v-for="item in itemCount" :key="item">
          <td v-for="column in columns" :key="`${item}-${column.prop}`">
            <div class="placeholder-glow">
              <span class="placeholder col-5 placeholder-xs" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
