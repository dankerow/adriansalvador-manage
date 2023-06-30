import type { Ref } from 'vue'

export function usePagination(loading: Ref<boolean>, totalPages: Ref<number>) {
  const currentPage: Ref<number> = ref(1)

  const nextPage = () => {
    if (loading.value) return
    if (currentPage.value < totalPages.value) currentPage.value += 1
  }

  const previousPage = () => {
    if (loading.value) return
    if (currentPage.value > 1) currentPage.value -= 1
  }

  const changePage = (value: number) => {
    if (loading.value) return
    currentPage.value = value
  }

  return { currentPage, nextPage, previousPage, changePage }
}
