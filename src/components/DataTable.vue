<script setup async lang="ts">
import { writeFile, utils } from 'xlsx'
import type { Ref } from 'vue'

interface PaginationOptions {
	enabled?: boolean
	lengthMenu?: number[]
	prop?: string
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
	stickyHeader?: boolean
	height?: string
	loading?: boolean
	data: object[]
	pagination?: PaginationOptions
	filters?: FilterOptions
	download?: {
		excel?: boolean
		csv?: boolean
		pdf?: boolean
	}
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	title: '',
	stickyHeader: false,
	loading: false,
	height: '700px',
	pagination: () => ({
		lengthMenu: [25, 50, 75, 100],
		count: 0,
		pages: 1,
		sort: {
			by: 'createdAt',
			order: 'desc'
		}
	}),
	filters: () => ({
		limit: 25
	})
})

const emit = defineEmits<{
	(e: 'loadData', filterData: object): void
}>()

const colorMode = useColorMode()

const currentPage: Ref<number> = ref(1)
const filtersData: Ref<FilterOptions | undefined> = ref<FilterOptions | undefined>(props.filters)
const tableData: Ref<object[]> = ref([])
const paginationData: Ref<PaginationOptions | undefined> = ref(props.pagination)

paginationData.value.enabled = true

const fireDataLoad = () => {
	emit('loadData', { page: currentPage.value, ...filtersData.value })

	filterData()
}

const nextPage = () => {
	if (props.loading) return

	if (currentPage.value < paginationData.value?.pages) {
		currentPage.value += 1
	}
}

const previousPage = () => {
	if (props.loading) return

	if (currentPage.value > 1) {
		currentPage.value -= 1
	}
}

const changePage = (value: number) => {
	if (props.loading) return

	currentPage.value = value
}

const filterData = () => {
	const data = props.data || []

	if (tableData.value && filtersData.value?.search) {
		const search = filtersData.value.search.toLowerCase()

		tableData.value = data.filter((item: any) => {
			return Object.keys(item).some((key: string) => {
				return item[key].toString().toLowerCase().includes(search)
			})
		})
	} else {
		tableData.value = data
	}

	if (tableData.value.length && filtersData.value?.sort) {
		const { by, order } = filtersData.value.sort

		tableData.value = tableData.value.sort((a: any, b: any) => {
			if (order === 'asc') {
				return a[by] > b[by] ? 1 : -1
			} else {
				return a[by] < b[by] ? 1 : -1
			}
		})
	}

	if (tableData.value.length && (tableData.value.length <= filtersData.value?.limit)) {
		const start = (currentPage.value - 1) * filtersData.value.limit
		const end = start + filtersData.value.limit

		tableData.value = tableData.value.slice(start, end)
	}
}

const downloadExcel = () => {
	const data = props.data
	const columns = props.columns

	const worksheet = utils.json_to_sheet(data, { header: columns.map((column: any) => column.prop) })
	const workbook = utils.book_new()
	utils.book_append_sheet(workbook, worksheet, 'Images')

	writeFile(workbook, 'table.xlsx')
}

watch(() => props.data, () => {
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

watch(() => ({ ...filtersData.value }), () => {
	fireDataLoad()
}, {
	deep: true,
	immediate: true
})

onMounted(() => {
	filterData()
})
</script>

<template>
	<div
		class="card"
		:class="{ 'bg-darker': colorMode.value === 'dark' }"
	>
		<div v-if="title" class="card-header">
			<h3 class="text-capitalize fw-bolder mb-0">
				{{ title }}
			</h3>
		</div>

		<div class="card-header">
			<div class="row row-cols-3">
				<div class="col-sm-12 col-md-6 col-lg-auto">
					<div class="table-entries-length">
						<label>
							Show

							<select v-model="filtersData.limit" class="form-select form-select-sm" aria-label="Length Menu">
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
								v-model="filtersData.search"
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
							<button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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

		<DataTableLoading v-if="loading" :item-count="filtersData.limit" :columns="columns" />

		<div v-else class="table-responsive" :style="{ height: stickyHeader && props.height }">
			<table
				v-if="tableData.length"
				:id="`table-${title}`"
				class="table table-hover"
				:class="{ 'table-light': colorMode.value === 'light', 'table-dark': colorMode.value === 'dark' }"
			>
				<thead :class="{ 'position-sticky top-0 z-3': stickyHeader }">
					<tr>
						<th v-for="column in columns" :key="column.prop" scope="col">
							<span class="text-bg-darker text-uppercase font-monospace px-2 py-1 rounded-1 text-nowrap">
								{{ column.label }}
							</span>
							<span v-if="column.sortable">
								<Icon name="ph:sort-ascending-duotone" size="1.5em" @click="filtersData" />
								<Icon name="ph:sort-descending-duotone" size="1.5em" @click="filtersData" />
							</span>
						</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="item in tableData" :key="item.id">
						<td v-for="column in columns" :key="`${item.id}-${column.prop}`" class="text-nowrap">
							<template v-if="column.cellOptions?.link && item.url">
								<NuxtLink :to="item.url">
									<nuxt-img
										v-if="column.cellOptions?.image && item.thumb"
										alt="Image placeholder"
										class="avatar rounded me-4"
										loading="lazy"
										:width="52"
										:height="52"
										:src="item.thumb && item.thumb.sizes ? `${item.thumb.sizes.square.url}?width=52` : ''"
									/>

									<span v-if="column.cellOptions?.date">
										<NuxtTime :datetime="item[column.prop]" date-style="long" time-style="long" />
									</span>
									<span v-else>
										{{ item[column.prop] }}
									</span>
								</NuxtLink>
							</template>

							<template v-else>
								<nuxt-img
									v-if="column.cellOptions?.image && item.thumb"
									alt="Image placeholder"
									class="avatar rounded me-3"
									loading="lazy"
									:width="52"
									:height="52"
									:src="item.thumb && item.thumb.sizes ? `${item.thumb.sizes.square.url}?width=52` : ''"
								/>

								<span v-if="column.cellOptions?.date">
									<NuxtTime :datetime="item[column.prop]" />
								</span>
								<span v-else>
									{{ item[column.prop] }}
								</span>
							</template>
						</td>
					</tr>
				</tbody>
			</table>
			<div v-else class="alert alert-primary mx-2 mt-3" role="alert">
				<strong>No data to display.</strong>
			</div>
		</div>

		<div v-if="paginationData.enabled" class="card-footer">
			<div class="row row-cols-2">
				<div class="col-sm-12 col-md-6">
					<div class="table-caption">
						Showing {{ tableData.length }} of {{ paginationData.count }} entr{{ paginationData.count > 1 ? 'ies' : 'y' }}
					</div>
				</div>

				<div class="col-sm-12 col-md-6">
					<div class="table-paginate">
						<Pagination
							:current-page="currentPage"
							:pages="paginationData.pages"
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
