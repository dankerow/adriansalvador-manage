<template>
	<nav aria-label="Pagination">
		<ul v-if="currentPage === 1" class="pagination">
			<li class="page-item disabled">
				<span class="page-link" tabindex="-1" aria-label="First" aria-disabled="true">
					<span aria-hidden="true">
						<AngleDoubleLeftIcon />
					</span>
					<span class="visually-hidden">First</span>
				</span>
			</li>
			<li class="page-item disabled">
				<span class="page-link" tabindex="-1" aria-label="Previous" aria-disabled="true">
					<span aria-hidden="true">
						<AngleLeftIcon />
					</span>
					<span class="visually-hidden">Previous</span>
				</span>
			</li>
			<li class="page-item active">
				<span class="page-link" aria-current="page">
					{{ currentPage }}
				</span>
			</li>
			<li v-if="pages > currentPage" class="page-item">
				<span class="page-link" @click="changePage(currentPage + 1)">
					{{ currentPage + 1 }}
				</span>
			</li>
			<li v-if="pages > currentPage + 1" class="page-item">
				<span class="page-link" @click="changePage(currentPage + 2)">
					{{ currentPage + 2 }}
				</span>
			</li>
			<li v-if="pages > currentPage" class="page-item">
				<span class="page-link" aria-label="Next" @click="nextPage()">
					<span aria-hidden="true">
						<AngleRightIcon />
					</span>
					<span class="visually-hidden">Next</span>
				</span>
			</li>
			<li v-if="pages > currentPage" class="page-item">
				<span class="page-link" aria-label="Last" @click="changePage(pages)">
					<span aria-hidden="true">
						<AngleDoubleRightIcon />
					</span>
					<span class="visually-hidden">Last</span>
				</span>
			</li>
			<li v-if="pages === currentPage" class="page-item disabled">
				<span class="page-link" tabindex="-1" aria-label="Next" aria-disabled="true">
					<span aria-hidden="true">
						<AngleRightIcon />
					</span>
					<span class="visually-hidden">Next</span>
				</span>
			</li>
			<li v-if="pages === currentPage" class="page-item disabled">
				<span class="page-link" tabindex="-1" aria-label="Last" aria-disabled="true">
					<span aria-hidden="true">
						<AngleDoubleRightIcon />
					</span>
					<span class="visually-hidden">Last</span>
				</span>
			</li>
		</ul>

		<ul v-else-if="currentPage === pages" class="pagination justify-content-center">
			<li class="page-item">
				<span class="page-link" aria-label="First" @click="changePage(1)">
					<span aria-hidden="true">
						<AngleDoubleLeftIcon />
					</span>
					<span class="visually-hidden">First</span>
				</span>
			</li>
			<li class="page-item">
				<span class="page-link" aria-label="Previous" @click="previousPage()">
					<span aria-hidden="true">
						<AngleLeftIcon />
					</span>
					<span class="visually-hidden">Previous</span>
				</span>
			</li>
			<li v-if="pages > 2" class="page-item">
				<span class="page-link" @click="changePage(currentPage - 2)">
					{{ currentPage - 2 }}
				</span>
			</li>
			<li class="page-item">
				<span class="page-link" @click="changePage(currentPage - 1)">
					{{ currentPage - 1 }}
				</span>
			</li>
			<li class="page-item active">
				<span class="page-link" aria-current="page">
					{{ currentPage }}
				</span>
			</li>
			<li class="page-item disabled">
				<span class="page-link" tabindex="-1" aria-label="Next" aria-disabled="true">
					<span aria-hidden="true">
						<AngleRightIcon />
					</span>
					<span class="visually-hidden">Next</span>
				</span>
			</li>
			<li class="page-item disabled">
				<span class="page-link" tabindex="-1" aria-label="Last" aria-disabled="true">
					<span aria-hidden="true">
						<AngleDoubleRightIcon />
					</span>
					<span class="visually-hidden">Last</span>
				</span>
			</li>
		</ul>

		<ul v-else class="pagination justify-content-center">
			<li class="page-item">
				<span class="page-link" aria-label="First" @click="changePage(1)">
					<span aria-hidden="true">
						<AngleDoubleLeftIcon />
					</span>
					<span class="visually-hidden">First</span>
				</span>
			</li>
			<li class="page-item">
				<span class="page-link" aria-label="Previous" @click="previousPage()">
					<span aria-hidden="true">
						<AngleLeftIcon />
					</span>
					<span class="visually-hidden">Previous</span>
				</span>
			</li>
			<li class="page-item">
				<span class="page-link" @click="changePage(currentPage - 1)">
					{{ currentPage - 1 }}
				</span>
			</li>
			<li class="page-item active">
				<span class="page-link" aria-current="page">
					{{ currentPage }}
				</span>
			</li>
			<li class="page-item">
				<span class="page-link" @click="changePage(currentPage + 1)">
					{{ currentPage + 1 }}
				</span>
			</li>
			<li class="page-item">
				<div class="page-link" aria-label="Next" @click="nextPage()">
					<span aria-hidden="true">
						<AngleRightIcon />
					</span>
					<span class="visually-hidden">Next</span>
				</div>
			</li>
			<li class="page-item">
				<span class="page-link" aria-label="Last" @click="changePage(pages)">
					<span aria-hidden="true">
						<AngleDoubleRightIcon />
					</span>
					<span class="visually-hidden">Last</span>
				</span>
			</li>
		</ul>
	</nav>
</template>

<script>
export default {
	components: {
		AngleLeftIcon: () => import('~/assets/icons/arrows/angle-left.svg?inline'),
		AngleRightIcon: () => import('~/assets/icons/arrows/angle-right.svg?inline'),
		AngleDoubleLeftIcon: () => import('~/assets/icons/arrows/angle-double-left.svg?inline'),
		AngleDoubleRightIcon: () => import('~/assets/icons/arrows/angle-double-right.svg?inline')
	},
	props: {
		currentPage: {
			type: Number,
			required: true
		},
		pages: {
			type: Number,
			required: true
		}
	},
	methods: {
		nextPage() {
			this.$emit('next-page')
		},
		changePage(value) {
			this.$emit('change-page', value)
		},
		previousPage() {
			this.$emit('previous-page')
		}
	}
}
</script>

<style lang="scss" scoped>
nav {
	padding: 1rem 0;
}

.pagination {
	margin: 0;
}

.page-link {
	cursor: pointer;
	display: inline;
	user-select: none;

	&[aria-disabled='true'] {
		cursor: default;
	}

	&[aria-current='page'] {
		cursor: default;
	}

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
