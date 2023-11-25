<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  pages: number
}>()

const emit = defineEmits<{
  (e: 'changePage', value: number): void
}>()

const changePage = (value: number) => {
  emit('changePage', value)
}

const pageRange = computed(() => {
  let start = props.currentPage - 1
  let end = props.currentPage + 1

  if (start < 1) {
    start = 1
    end = start + 2
  }

  if (end > props.pages) {
    end = props.pages
    start = end - 2
  }

  start = Math.max(start, 1);
  end = Math.min(end, props.pages);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>

<template>
  <nav aria-label="Pagination">
    <ul class="pagination m-0">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <span class="page-link" @click="changePage(1)">
          <span aria-hidden="true">
            <Icon name="ic:twotone-keyboard-double-arrow-left" />
          </span>
          <span class="visually-hidden">First</span>
        </span>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <span class="page-link" @click="changePage(currentPage - 1)">
          <span aria-hidden="true">
            <Icon name="ic:twotone-keyboard-arrow-left" />
          </span>
          <span class="visually-hidden">Previous</span>
        </span>
      </li>
      <li v-for="i in pageRange" :key="i" class="page-item" :class="{ active: i === currentPage }">
        <span class="page-link" @click="changePage(i)">{{ i }}</span>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === pages }">
        <span class="page-link" @click="changePage(currentPage + 1)">
          <span aria-hidden="true">
            <Icon name="ic:twotone-keyboard-arrow-right" />
          </span>
          <span class="visually-hidden">Next</span>
        </span>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === pages }">
        <span class="page-link" @click="changePage(pages)">
          <span aria-hidden="true">
            <Icon name="ic:twotone-keyboard-double-arrow-right" />
          </span>
          <span class="visually-hidden">Last</span>
        </span>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
nav {
	padding: 1rem 0;
}

.pagination {
	margin: 0;
}

.page-link {
	cursor: pointer;
	user-select: none;

	svg {
		height: .870rem;
		vertical-align: middle;
		width: .870rem;
	}
}

.page-item {
	&.active .page-link {
		border-radius: 0.10rem;
		box-shadow: 0 7px 14px rgba(50, 50, 93, .1), 0 3px 6px rgba(0, 0, 0, .08);
	}
}

.dark-mode {
	.pagination {
		--bs-pagination-color: #8a8a8a;
		--bs-pagination-bg: rgb(24, 24, 24);
		--bs-pagination-border-color: #606060;
		--bs-pagination-hover-color: #212121;
		--bs-pagination-active-color: #e9e9e9;
		--bs-pagination-active-bg: #1b1b1b;
		--bs-pagination-active-border-color: #909090;
		--bs-pagination-disabled-color: #4a4a4a;
		--bs-pagination-disabled-bg: rgb(24, 24, 24);
		--bs-pagination-disabled-border-color: #242424;
	}
}
</style>
