export function usePagination(totalPages: number) {
  const currentPage = ref<number>(1)

  const changePage = (value: number) => {
    currentPage.value = value
  }

  return { currentPage, changePage }
}
