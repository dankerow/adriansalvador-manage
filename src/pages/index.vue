<template>
	<div>
		<div :class="`header ${$colorMode.value === 'dark' ? 'bg-darker' : '' } pt-4 pb-6`">
			<div class="container-fluid">
				<div class="row pb-4">
					<div class="col-lg-6 col-7">
						<div class="icon icon-shape icon-shape-dark me-2 shadow-sm">
							<HomeIcon />
						</div>

						<h3 class="fw-bolder text-uppercase d-inline-block mb-0">
							Dashboard
						</h3>
					</div>
				</div>

				<div class="row row-cols-1 row-cols-lg-4">
					<div class="col">
						<div :class="`card card-stats ${$colorMode.value === 'dark' ? 'bg-primary' : '' }`">
							<div class="card-body">
								<div class="row">
									<div class="col-auto">
										<NuxtLink to="/albums" aria-label="Albums">
											<div class="icon icon-shape icon-shape-red">
												<HomeIcon />
											</div>
										</NuxtLink>
									</div>

									<div class="col">
										<h5 class="card-title text-uppercase text-muted mb-0">
											Albums
										</h5>
										<span class="fs-3 fw-bold">{{ count }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="col">
						<div :class="`card card-stats ${$colorMode.value === 'dark' ? 'bg-primary' : '' }`">
							<div class="card-body">
								<div class="row">
									<div class="col-auto">
										<NuxtLink to="/albums" aria-label="Albums">
											<div class="icon icon-shape icon-shape-blue">
												<HomeIcon />
											</div>
										</NuxtLink>
									</div>

									<div class="col">
										<h5 class="card-title text-uppercase text-muted mb-0">
											Images
										</h5>
										<span class="fs-3 fw-bold">4536</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="col">
						<div :class="`card card-stats ${$colorMode.value === 'dark' ? 'bg-primary' : '' }`">
							<div class="card-body">
								<div class="row">
									<div class="col-auto">
										<NuxtLink to="/holders" aria-label="Holders">
											<div class="icon icon-shape icon-shape-green">
												<HomeIcon />
											</div>
										</NuxtLink>
									</div>

									<div class="col">
										<h5 class="card-title text-uppercase text-muted mb-0">
											Views
										</h5>
										<span class="fs-3 fw-bold">12537</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="col">
						<div :class="`card card-stats ${$colorMode.value === 'dark' ? 'bg-primary' : '' }`">
							<div class="card-body">
								<div class="row">
									<div class="col-auto">
										<NuxtLink to="/holders" aria-label="Holders">
											<div class="icon icon-shape icon-shape-orange">
												<HomeIcon />
											</div>
										</NuxtLink>
									</div>

									<div class="col">
										<h5 class="card-title text-uppercase text-muted mb-0">
											Downloads
										</h5>
										<span class="fs-3 fw-bold">298</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="container-fluid">
			<div class="row row-cols-1 row-cols-lg-2">
				<div class="col col-lg-8 mt-n4">
					<div :class="`card ${$colorMode.value === 'dark' ? 'bg-primary' : '' }`">
						<div class="card-header">
							<div class="row align-items-center">
								<div class="col">
									<h3 class="mb-0">
										Albums
									</h3>
								</div>
							</div>
						</div>

						<Table :columns="table.columns" url="/api/albums" />
					</div>
				</div>

				<div class="col col-lg-4 mt-lg-n4">
					<div class="row row-cols-1">
						<div class="col">
							<div :class="`card ${$colorMode.value === 'dark' ? 'bg-dark' : '' }`">
								<div class="card-header">
									<div class="row row-cols-2">
										<div class="col">
											<h1 class="h3 mb-0">
												Recent Activities
											</h1>
										</div>

										<div class="col">
											<NuxtLink
												to="/reports/audits"
												:class="`btn btn-sm btn-primary float-end ${!audits.length ? 'disabled' : ''}`"
												:disabled="!audits.length"
											>
												View all
											</NuxtLink>
										</div>
									</div>
								</div>

								<div class="card-body">
									<template v-if="audits.length">
										<div
											v-for="(audit, index) in audits"
											:key="index"
											:class="`d-flex align-baseline ${index === 0 ? 'pb-3' : 'py-3'} ${index !== audits.length - 1 ? 'border-bottom' : ''}`"
										>
											<div class="d-inline-block me-3">
												<template v-if="audit.type === 1">
													<div class="icon icon-sm icon-shape icon-shape-green shadow-sm">
														<PlusIcon />
													</div>
												</template>
												<template v-else-if="audit.type === 2">
													<div class="icon icon-sm icon-shape icon-shape-orange shadow-sm">
														<EditIcon />
													</div>
												</template>
												<template v-else-if="audit.type === 3">
													<div class="icon icon-sm icon-shape icon-shape-red shadow-sm">
														<TrashAltIcon />
													</div>
												</template>
											</div>

											<div class="d-inline-block">
												<h6 class="mb-0">
													{{ audit.transactionDate }}
												</h6>

												<p class="fs-4 mb-0">
													{{ audit.user.firstName }} {{ audit.user.lastName[0] }}.
													<template v-if="audit.type === 1">
														added
													</template>
													<template v-else-if="audit.type === 2">
														edited
													</template>
													<template v-else-if="audit.type === 3">
														deleted
													</template>

													an asset
												</p>
											</div>
										</div>
									</template>

									<template v-else>
										<div class="alert alert-sm alert-primary" role="alert">
											<strong>No records at the moment.</strong>
										</div>
									</template>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	components: {
		HomeIcon: () => import('~/assets/icons/home.svg?inline')
	},
	async asyncData({ $axios }) {
		const { count } = await $axios.$get('/api/albums')

		return {
			count
		}
	},
	data() {
		return {
			audits: [],
			table: {
				columns: [
					{
						label: 'Name',
						prop: 'name',
						cellOptions: {
							link: true
						}
					},
					{
						label: 'File Count',
						prop: 'fileCount'
					},
					{
						label: 'hidden',
						prop: 'hidden'
					},
					{
						label: 'NSFW',
						prop: 'nsfw'
					},
					{
						label: 'Created At',
						prop: 'createdAt'
					},
					{
						label: 'Modified At',
						prop: 'modifiedAt'
					}
				]
			}
		}
	}
}
</script>
