<script setup async lang="ts">
import type { Ref } from 'vue'
import { writeFile, utils } from 'xlsx'

interface PaginationOptions {
  lengthMenu?: number[]
  count?: number
  pages?: number
}

interface FilterOptions {
  search?: string
  limit?: number
  sort?: {
    by?: string
    order?: string
  }
}

interface Props {
  title?: string
  columns: object[]
  selection?: boolean
  multipleSelection?: boolean
  stickyHeader?: boolean
  height?: string
  loading?: boolean
  data: object[]
  pagination?: PaginationOptions
  filters?: FilterOptions
  buttons?: {
    name: string
    text: string
    icon?: string
    url?: string
    disabled?: boolean
    callback?:() => void
  }[],
  download?: {
    excel?: boolean
    csv?: boolean
    pdf?: boolean
  }
  show?: {
    pagination?: boolean
  }
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  title: '',
  selection: false,
  stickyHeader: false,
  loading: false,
  height: '700px',
  pagination: () => ({
    lengthMenu: [25, 50, 75, 100],
    count: 0,
    pages: 1
  }),
  filters: () => ({
    search: '',
    limit: 25
  }),
  show: () => ({
    pagination: true
  })
})

const emit = defineEmits<{
  (e: 'loadData', filterData: object): void
}>()

const colorMode = useColorMode()
const slots = useSlots()

const currentPage: Ref<number> = ref(1)
const tableData: Ref<object[]> = ref([])
const selectedRows: Ref<object[]> = ref([])

const {
  title,
  columns,
  multipleSelection,
  stickyHeader,
  height,
  loading,
  data,
  pagination,
  filters,
  buttons,
  download,
  show
} = toRefs(props)

const fireDataLoad = () => {
  emit('loadData', { page: currentPage.value, ...filters.value })

  filterData()
}

const nextPage = () => {
  if (loading.value) {
    return
  }

  if (currentPage.value < pagination.value.pages) {
    currentPage.value += 1
  }
}

const previousPage = () => {
  if (loading.value) {
    return
  }

  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

const changePage = (value: number) => {
  if (loading.value) {
    return
  }

  currentPage.value = value
}

const filterData = () => {
  if (tableData.value && filters.value.search) {
    const search = filters.value.search.toLowerCase()

    tableData.value = data.filter((item: any) => {
      return Object.keys(item).some((key: string) => {
        return item[key].toString().toLowerCase().includes(search)
      })
    })
  } else {
    tableData.value = data.value
  }

  if (tableData.value.length && filters.value.sort) {
    const {
      by,
      order
    } = filters.value.sort

    tableData.value = tableData.value.sort((a: any, b: any) => {
      if (order === 'asc') {
        return a[by] > b[by] ? 1 : -1
      } else {
        return a[by] < b[by] ? 1 : -1
      }
    })
  }

  if (show.pagination && tableData.value.length && (tableData.value.length <= filters.value.limit)) {
    const start = (currentPage.value - 1) * filters.value.limit
    const end = start + filters.value.limit

    tableData.value = tableData.value.slice(start, end)
  }
}

const getColumnWidth = (column: any) => {
  if (column.width) {
    return column.width
  }

  if (column.prop) {
    // compute the column's width percentage based on the longest string in the column
    const longest = tableData.value.reduce((acc: any, item: any) => {
      if (item[column.prop].toString().length > acc.toString().length) {
        return item[column.prop]
      }

      return acc
    }, '')

    // add 10% to the longest string to allow for some padding
    const percentage = (longest.toString().length + 2) / 100

    // if the column is sortable, add 10% to the width
    if (column.sortable) {
      return `${Math.ceil(percentage * 110)}%`
    }

    return `${Math.ceil(percentage * 100)}%`
  }

  return 60
}

const isRowSelected = (row: object) => {
  return selectedRows.value.includes(row)
}

const isAllSelected = computed(() => {
  return selectedRows.value.length === tableData.value.length
})

const selectAll = () => {
  selectedRows.value = isAllSelected.value ? [] : tableData.value
}

const selectRow = (row: object) => {
  if (multipleSelection.value) {
    if (selectedRows.value.includes(row)) {
      selectedRows.value = selectedRows.value.filter((item: any) => item !== row)
    } else {
      selectedRows.value.push(row)
    }
  } else {
    selectedRows.value = [row]
  }
}

const deselectAllRows = () => {
  selectedRows.value = []
}

const sort = (column: any) => {
  if (column.sortable) {
    filters.value.sort.by = column.prop
    filters.value.sort.order = filters.value.sort.order === 'asc' ? 'desc' : 'asc'
  }
}

const downloadExcel = () => {
  const worksheet = utils.json_to_sheet(data, { header: columns.map((column: any) => column.prop) })
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Images')

  writeFile(workbook, 'table.xlsx')
}

watch(data, () => {
  filterData()
}, {
  deep: true,
  immediate: true
})

watch(currentPage, () => {
  fireDataLoad()
}, {
  deep: true,
  immediate: true
})

watch(() => ({ ...filters.value }), () => {
  fireDataLoad()
}, {
  deep: true,
  immediate: true
})

onMounted(() => {
  filterData()
})

defineExpose({
  selectedRows,
  deselectAllRows
})
</script>

<template>
  <div class="card">
    <div v-if="title" class="card-header">
      <div class="row row-cols-2">
        <div class="col-sm-12 col-md-6 col-lg-auto">
          <h3 class="text-capitalize fw-bolder mb-0">
            {{ title }}
          </h3>
        </div>
        <div v-if="buttons?.length" class="col-sm-12 col-md-6 col-lg text-end">
          <template v-for="button in buttons" :key="button.name">
            <slot
              v-if="slots[`button-${button.name.replace(/ /g, '-')}`]"
              :name="`button-${button.name.replace(/ /g, '-')}`"
              v-bind="{ button }"
            />
            <slot
              v-else-if="slots[`button-${button.name.replace(/ /g, '-').toLowerCase()}`]"
              :name="`button-${button.name.replace(/ /g, '-').toLowerCase()}`"
              v-bind="{ button }"
            />
            <slot
              v-else-if="slots.button"
              name="button"
            />
            <template v-else>
              <NuxtLink
                v-if="button.url"
                :key="button.name"
                :to="button.url"
                class="btn btn-sm btn-primary"
                :class="{ disabled: button.disabled }"
                :disabled="button.disabled"
              >
                <Icon v-if="button.icon" :name="button.icon" />
                <span>
                  {{ button.text }}
                </span>
              </NuxtLink>
              <button
                v-else
                :key="button.name"
                class="btn btn-sm btn-primary"
                :class="{ disabled: button.disabled }"
                :disabled="button.disabled"
                @click="button.callback"
              >
                <Icon v-if="button.icon" :name="button.icon" />
                <span>
                  {{ button.text }}
                </span>
              </button>
            </template>
          </template>
        </div>
      </div>
    </div>

    <div class="card-header">
      <div class="row row-cols-3">
        <div class="col-sm-12 col-md-6 col-lg-auto">
          <div class="table-entries-length">
            <label>
              Showing

              <select v-model="filters.limit" class="form-select form-select-sm" aria-label="Length Menu">
                <option :value="25">
                  25
                </option>
                <option :value="50">
                  50
                </option>
                <option :value="75">
                  75
                </option>
                <option :value="100">
                  100
                </option>
              </select>

              entries
            </label>
          </div>
        </div>

        <div class="col-sm-12 col-md-6 col-lg">
          <div class="table-filter">
            <label>
              Search:
              <input
                id="table-search"
                v-model="filters.search"
                type="text"
                class="form-control form-control-sm"
                placeholder="Enter something"
              >
            </label>
          </div>
        </div>

        <div v-if="download && (download.excel || download.csv || download.pdf)" class="col-sm-12 col-md-6 col-lg-auto">
          <div class="table-download">
            <div class="btn-group">
              <button
                class="btn btn-sm btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Download
              </button>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li>
                  <span
                    v-if="download?.excel"
                    class="dropdown-item"
                    type="button"
                    @click="downloadExcel"
                  >
                    Excel
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DataTableLoading v-if="loading" :item-count="filters.limit" :columns="columns" />

    <div v-else class="table-responsive" :style="{ height: stickyHeader && height }">
      <table
        v-if="tableData.length"
        :id="`table-${title}`"
        class="table table-bordered table-hover align-middle"
      >
        <thead :class="{ 'position-sticky top-0 z-3': stickyHeader, 'table-light': colorMode.value === 'light', 'table-dark': colorMode.value === 'dark' }">
          <tr>
            <th v-if="selection && multipleSelection" scope="col" :style="{ width: '1%', minWidth: '38px' }">
              <input
                id="checkDefault" class="form-check-input" type="checkbox" value="" :checked="isAllSelected"
                aria-label="Check Default"
                @click="selectAll"
              >
            </th>
            <th v-for="column in columns" :key="column.prop" scope="col" :style="{ width: getColumnWidth(column) }">
              <span class="text-nowrap text-capitalize">
                {{ column.label }}
              </span>
              <span v-if="column.sortable && filters.sort?.order">
                <Icon
                  v-if="filters.sort.order === 'asc'" name="ph:sort-ascending-duotone" size="1.5em"
                  @click="sort(column)"
                />
                <Icon
                  v-if="filters.sort.order === 'desc'" name="ph:sort-descending-duotone" size="1.5em"
                  @click="sort(column)"
                />
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td v-if="selection">
              <div class="mx-auto">
                <input
                  :id="`${item.id}-check`" class="form-check-input" type="checkbox" value="" :checked="isRowSelected(item)"
                  aria-label="Check Default"
                  @click="selectRow(item)"
                >
              </div>
            </td>
            <td v-for="column in columns" :key="`${item.id}-${column.prop}`" class="text-nowrap">
              <slot
                v-if="slots[`item-${column.label.replace(/ /g, '-')}`]"
                :name="`item-${column.label.replace(/ /g, '-')}`"
                v-bind="{ column, item }"
              />
              <slot
                v-else-if="slots[`item-${column.label.replace(/ /g, '-').toLowerCase()}`]"
                :name="`item-${column.label.replace(/ /g, '-').toLowerCase()}`"
                v-bind="{ column, item }"
              />
              <slot
                v-else-if="slots.item"
                name="item"
                v-bind="{ column, item }"
              />

              <span v-else>
                {{ item[column.prop] }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="alert alert-primary mx-2 mt-3" role="alert">
        <strong>No data to display.</strong>
      </div>
    </div>

    <div v-if="show.pagination" class="card-footer">
      <div class="row row-cols-2 align-items-center">
        <div class="col-sm-12 col-md-6">
          <div class="table-caption">
            Showing {{ tableData.length }} of {{ pagination.count }} entr{{ pagination.count > 1 ? 'ies' : 'y' }}
          </div>
        </div>

        <div class="col-sm-12 col-md-6">
          <div class="table-paginate">
            <Pagination
              :current-page="currentPage"
              :pages="pagination.pages"
              @next-page="nextPage"
              @previous-page="previousPage"
              @change-page="changePage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  font-size: 0.875rem;
}

.table-responsive {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #252525;
  }

  &::-webkit-scrollbar-button {
    display: none;
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}

.table-entries-length {
  label {
    font-weight: normal;
    text-align: left;
    white-space: nowrap;
  }

  .form-select {
    display: inline-block;
    width: auto;
  }
}

.table-filter {
  text-align: right;

  label {
    font-weight: normal;
    text-align: left;
    white-space: nowrap;
  }

  .form-control {
    display: inline-block;
    margin-left: 0.5rem;
    width: auto;
  }
}

.table-paginate {
  float: right;
  margin: 0;
  text-align: right;
  white-space: nowrap;
}

.table-caption, .table-paginate {
  display: inline-block;
}
</style>
