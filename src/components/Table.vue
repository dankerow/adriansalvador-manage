<template>
	<div :class="`card ${$colorMode.value === 'dark' ? 'bg-dark' : '' }`">
		<div v-if="title" class="card-header text-center">
			<h3 class="text-uppercase fw-bold mb-0">
				{{ title }}
			</h3>
		</div>

		<div class="card-header">
			<div class="row row-cols-2">
				<div class="col-sm-12 col-md-6">
					<div class="table-entries-length">
						<label>
							Show

							<select v-model="filters.length" class="form-select form-select-sm" aria-label="Length Menu" @change="fetch">
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

				<div class="col-sm-12 col-md-6">
					<div class="table-filter">
						<label>
							Search:
							<input
								id="table-search"
								v-model="filters.search"
								type="text"
								class="form-control form-control-sm"
								placeholder="Enter something"
								@input="fetch"
							>
						</label>
					</div>
				</div>
			</div>
		</div>

		<div v-if="!loading" class="table-responsive">
			<table :id="`table-${title}`" :class="`table table-sm table-hover ${$colorMode.value === 'dark' ? 'table-dark' : '' } align-middle align-items-center`">
				<template v-if="tableData.length">
					<thead :class="$colorMode.value === 'dark' ? 'thead-dark' : 'thead-light'">
						<tr>
							<th v-for="column in columns" :key="column.prop" scope="col">
								{{ column.label }}
							</th>
						</tr>
					</thead>

					<tbody>
						<tr v-for="item in tableData" :key="item.id">
							<td v-for="column in columns" :key="`${item.id}-${column.prop}`">
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
											@error="error()"
										/>

										{{ item[column.prop] }}
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
										@error="error()"
									/>

									{{ item[column.prop] }}
								</template>
							</td>
						</tr>
					</tbody>
				</template>

				<template v-else>
					<tbody>
						<tr>
							<td>
								<div class="alert alert-primary mx-2 mt-3" role="alert">
									<strong>No data to display.</strong>
								</div>
							</td>
						</tr>
					</tbody>
				</template>
			</table>
		</div>

		<TableLoading v-else :item-count="filters.length" :columns="columns" />

		<div class="card-footer">
			<div class="row row-cols-2">
				<div class="col-sm-12 col-md-6">
					<div class="table-caption">
						Showing {{ tableData.length || 0 }} of {{ paginationD.count || 0 }} entr{{ (paginationD.count || 0) > 1 ? 'ies' : 'y' }}
					</div>
				</div>

				<div class="col-sm-12 col-md-6">
					<div class="table-paginate">
						<Pagination
							:current-page="currentPage"
							:pages="paginationD.pages"
							@next-page="changePage('next')"
							@previous-page="changePage('previous')"
							@change-page="changePage"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: () => ''
		},
		columns: {
			type: Array,
			default: () => []
		},
		lengthMenu: {
			type: Array,
			default: () => [25, 50, 75, 100]
		},
		sortBy: {
			type: String,
			default: ''
		},
		sortOrder: {
			type: String,
			default: ''
		},
		url: {
			type: String,
			default: () => ''
		},
		urlQuery: {
			type: String,
			default: () => ''
		},
		data: {
			type: Array,
			default: () => []
		},
		dataProp: {
			type: String,
			default: () => 'data'
		},
		pagination: {
			type: Object,
			default: () => Object
		}
	},
	data() {
		return {
			tableData: this.data,
			loading: true,
			filters: {
				search: '',
				length: 25,
				sort: {
					by: this.sortBy,
					order: this.sortOrder
				}
			},
			paginationD: {
				count: 0,
				pages: 1,
				...this.pagination
			},
			currentPage: 1
		}
	},
	watch: {
		data: {
			immediate: true,
			handler(value) {
				this.tableData = value
			}
		}
	},
	created() {
		this.fetch()
	},
	methods: {
		changePage(value) {
			switch (value) {
			case 'next':
				this.currentPage += 1
				break
			case 'previous':
				this.currentPage -= 1
				break
			default:
				this.currentPage = value
				break
			}

			this.fetch()
		},
		error(event) {
			event.target.src = '/images/avatars/default-avatar-assets.png'
		},
		getValue(obj, path) {
			if (!path) return obj
			const properties = path.split('.')
			return this.getValue(obj[properties.shift()], properties.join('.'))
		},
		async fetch() {
			if (!this.url) return

			try {
				this.loading = true
				// Change the params here based on your own api
				const params = {
					page: this.currentPage,
					limit: this.filters.length
				}

				if (this.filters.search) {
					params.s = this.filters.search
				}

				if (this.filters.sort) {
					params.sort = this.filters.sort
				}

				const fullUrl = this.url + this.urlQuery
				const fetchedData = await this.$axios.$get(fullUrl, { params })

				this.tableData = this.getValue(fetchedData, this.dataProp)
				this.paginationD = { count: this.getValue(fetchedData, this.pagination.prop).count, pages: this.getValue(fetchedData, this.pagination.prop).pages }
			} catch (err) {
				console.log(err)
				this.loading = false
			} finally {
				this.loading = false
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.card {
	font-size: 0.875rem;
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
