<script setup lang="ts">
import type { Column, Row, Props } from '@/types'

import defu from 'defu'

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  title: '',
  selection: false,
  multipleSelection: false,
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
  sort: () => ({
    column: null,
    direction: 'asc'
  }),
  buttons: () => [],
  download: () => ({
    excel: false,
    csv: false,
    pdf: false
  }),
  show: () => ({
    pagination: true
  })
})

const emit = defineEmits<{
  (e: 'loadData', filterData: { page: number, search?: string, limit?: number, sort?: { by?: string, order?: string } }): void
  (e: 'update:sort', sort: { column: string | null, direction: string | null }): void
}>()

const { setData, downloadExcel, downloadCSV, downloadPDF } = useDataExporter()

const selectedRows = ref<Row[]>([])
const sort = ref(defu({}, props.sort, { column: null, direction: 'asc' }))
const defaultSort = { column: sort.value.column, direction: null }
const pagination = ref(defu({}, props.pagination, { pages: 1, count: 0, lengthMenu: [25, 50, 75, 100] }))
const filters = ref(defu({}, props.filters, { search: '', limit: 25 }))

const { currentPage, changePage } = usePagination(pagination.value.pages)

const {
  multipleSelection,
  show
} = toRefs(props)

setData(props.data)

const fireDataLoad = () => {
  emit('loadData', { page: currentPage.value, ...filters.value, ...sort.value })
}

const isRowSelected = (row: Row) => {
  return selectedRows.value.includes(row)
}

const selectAll = () => {
  selectedRows.value = isAllSelected.value ? [] : data.value
}

const selectRow = (row: Row) => {
  if (multipleSelection.value) {
    if (selectedRows.value.includes(row)) {
      selectedRows.value = selectedRows.value.filter((item) => item !== row)
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

const sortColumn = (column: Column) => {
  if (sort.value.column === column.prop) {
    const direction = !column.direction || column.direction === 'asc' ? 'desc' : 'asc'

    if (sort.value.direction === direction) {
      sort.value = defu({}, defaultSort, { column: null, direction: 'asc' })
    } else {
      sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
    }
  } else {
    sort.value = { column: column.prop, direction: column.direction || 'asc' }
  }

  emit('update:sort', sort.value)
}

const getItemProp = (item: Row, column: Column) => {
  return item[column.prop]
}

const data = computed(() => {
  let result = props.data

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()

    result = result.filter((item: Row) => {
      return Object.keys(item).some((key: string) => {
        return item[key].toString().toLowerCase().includes(search)
      })
    })
  }

  if (sort.value?.column) {
    const { column, direction } = sort.value

    result = props.data.slice().sort((a, b) => {
      const aValue = a[column]
      const bValue = b[column]

      if (aValue === bValue) {
        return 0
      }

      if (direction === 'asc') {
        return aValue < bValue ? -1 : 1
      } else {
        return aValue > bValue ? -1 : 1
      }
    })
  }

  if (show.value.pagination && (props.data.length > filters.value.limit)) {
    const start = (currentPage.value - 1) * filters.value.limit
    const end = start + filters.value.limit

    result = result.slice(start, end)
  }

  return result
})

const columns = computed(() => {
  return props.columns
})

const buttons = computed(() => {
  return props.buttons
})

const isAllSelected = computed(() => {
  return selectedRows.value.length === data.value.length
})

watch(currentPage, () => {
  fireDataLoad()
}, {
  deep: true
})

watch(() => ({ ...filters.value, ...sort.value }), () => {
  fireDataLoad()
}, {
  deep: true
})

defineExpose({
  selectedRows,
  deselectAllRows
})
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div
        v-if="title"
        class="row row-cols-2 mb-3"
      >
        <div class="col-sm-12 col-md-6 col-lg-auto">
          <h5 class="text-capitalize fw-bolder mb-0">
            {{ title }}
          </h5>
        </div>

        <div
          v-if="buttons?.length"
          class="col-sm-12 col-md-6 col-lg text-end"
        >
          <slot
            v-for="(button, index) in buttons"
            :key="index"
            :name="`button-${button.name.replace(/ /g, '-').toLowerCase()}`"
            v-bind="{ button }"
          >
            <NuxtLink
              v-if="button.url"
              :key="`${button.name}-link-${index}`"
              :to="button.url"
              class="btn btn-sm btn-primary"
              :class="{ disabled: button.disabled }"
              :disabled="button.disabled"
            >
              <Icon
                v-if="button.icon"
                :name="button.icon"
              />
              <span>
                {{ button.text }}
              </span>
            </NuxtLink>

            <button
              v-else
              :key="`${button.name}-${index}`"
              class="btn btn-sm btn-primary"
              :class="{ disabled: button.disabled }"
              :disabled="button.disabled"
              @click="button.callback"
            >
              <Icon
                v-if="button.icon"
                :name="button.icon"
              />
              <span>
                {{ button.text }}
              </span>
            </button>
          </slot>
        </div>
      </div>

      <div class="row row-cols-3 mb-3">
        <div class="col-sm-12 col-md-6 col-lg-auto">
          <div class="table-entries-length">
            <label>
              Showing

              <select
                v-model="filters.limit"
                class="form-select form-select-sm"
                aria-label="Length Menu"
              >
                <option
                  v-for="(length, index) in pagination.lengthMenu"
                  :key="index"
                  :value="length"
                >
                  {{ length }}
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

        <div
          v-if="download && (download.excel || download.csv || download.pdf)"
          class="col-sm-12 col-md-6 col-lg-auto"
        >
          <div class="table-download">
            <div class="btn-group">
              <button
                class="btn btn-sm btn-primary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
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
                <li>
                  <span
                    v-if="download?.csv"
                    class="dropdown-item"
                    type="button"
                    @click="downloadCSV"
                  >
                    CSV
                  </span>
                </li>
                <li>
                  <span
                    v-if="download?.pdf"
                    class="dropdown-item"
                    type="button"
                    @click="downloadPDF"
                  >
                    PDF
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <hr>

      <div
        class="table-responsive"
        :style="{ height: stickyHeader ? height : undefined }"
      >
        <table class="table table-hover align-middle">
          <thead :class="{ 'position-sticky top-0 z-3': stickyHeader }">
            <tr>
              <th
                v-if="selection && multipleSelection"
                scope="col"
              >
                <input
                  id="checkDefault"
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  :checked="isAllSelected"
                  aria-label="Select all rows"
                  @click="selectAll"
                >
              </th>

              <th
                v-for="column in columns"
                :key="column.prop"
                scope="col"
              >
                <span class="text-nowrap text-capitalize">
                  {{ column.label }}
                </span>

                <button
                  v-if="column.sortable"
                  class="btn btn-sm shadow-none"
                  @click="sortColumn(column)"
                >
                  <Icon
                    :name="!sort.column || sort.column !== column.prop ? 'ph:arrows-out-line-vertical-duotone' : sort.direction === 'asc' ? 'ph:sort-ascending-duotone' : 'ph:sort-descending-duotone'"
                    size="1.5em"
                  />
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            <template v-if="loading">
              <tr
                v-for="item in filters.limit"
                :key="item"
              >
                <td
                  v-for="column in columns"
                  :key="`${item}-${column.prop}`"
                >
                  <div class="placeholder-glow">
                    <span class="placeholder col-5 placeholder-xs" />
                  </div>
                </td>
              </tr>
            </template>

            <tr v-else-if="!data.length">
              <td :colspan="columns.length + (selection ? 1 : 0)">
                <div
                  class="alert alert-primary mx-2 mt-3"
                  role="alert"
                >
                  <strong>No data to display.</strong>
                </div>
              </td>
            </tr>

            <template v-else>
              <tr
                v-for="(item, index) in data"
                :key="index"
              >
                <td v-if="selection">
                  <input
                    :id="`${item.id}-check`"
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    :checked="isRowSelected(item)"
                    aria-label="Check Default"
                    @click="selectRow(item)"
                  >
                </td>

                <td
                  v-for="(column, subIndex) in columns"
                  :key="subIndex"
                  class="text-nowrap"
                >
                  <slot
                    :name="`item-${column.prop}`"
                    :column="column"
                    :item="item"
                  >
                    {{ getItemProp(item, column) }}
                  </slot>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div
        v-if="show.pagination"
        class="row row-cols-2 align-items-center"
      >
        <div class="col-sm-12 col-md-6">
          <div class="table-caption">
            Showing {{ data.length }} of {{ pagination.count }} entr{{ pagination.count > 1 ? 'ies' : 'y' }}
          </div>
        </div>

        <div class="col-sm-12 col-md-6">
          <div class="table-paginate">
            <Pagination
              :current-page="currentPage"
              :pages="pagination.pages"
              @change-page="changePage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-responsive {
  &::-webkit-scrollbar {
    width: 6px;
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

th {
  color: var(--bs-secondary-color);
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
