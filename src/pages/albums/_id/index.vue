<template>
	<div>
		<div :class="`header ${$colorMode.value === 'dark' ? 'bg-darker' : '' } pt-4 pb-6`">
			<div class="container-fluid">
				<div class="row align-items-center">
					<div class="col-6 col-md-3 col-lg-4">
						<div class="icon icon-shape icon-shape-dark me-2 shadow-sm">
							<FolderOpenIcon />
						</div>
						<h3 class="fw-bolder text-uppercase d-inline-block mb-0">
							Albums / {{ album.name }}
						</h3>
					</div>

					<div class="col-6 col-md-9 col-lg-8 text-end">
						<NuxtLink v-if="user.permissions.administrator" to="/albums/add" :class="`btn btn-sm ${$colorMode.value === 'dark' ? 'btn-dark' : 'btn-white' }`">
							Upload images
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>

		<div class="container-fluid mt-n4">
			<div class="row justify-content-center">
				<div class="col-lg-12">
					<div :class="`card ${$colorMode.value === 'dark' ? 'bg-dark' : '' } mb-5`">
						<div class="card-header text-center">
							<h3 class="mb-0">
								{{ album.name }}
							</h3>
						</div>

						<div class="card-body">
							<div class="row">
								<div class="col-lg-4">
									<div class="card-profile-stats justify-content-center">
										<div :class="`card card-stats ${$colorMode.value === 'dark' ? 'bg-primary' : '' }`">
											<div class="card-body">
												<div class="row">
													<div class="col-auto">
														<div class="icon icon-shape icon-shape-blue">
															<i class="bx bxs-purchase-tag" />
														</div>
													</div>

													<div class="col">
														<h5 class="card-title text-uppercase text-muted mb-0">
															Image Count
														</h5>
														<span class="h4 fw-bold mb-0">
															{{ album.fileCount }}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div class="col-lg-4">
									<div class="card-profile-stats justify-content-center">
										<div :class="`card card-stats ${$colorMode.value === 'dark' ? 'bg-primary' : '' }`">
											<div class="card-body">
												<div class="row">
													<div class="col-auto">
														<div class="icon icon-shape icon-shape-green">
															<i class="bx bxs-group" />
														</div>
													</div>
													<div class="col">
														<h5 class="card-title text-uppercase text-muted mb-0">
															Hidden
														</h5>
														<span class="h4 fw-bold mb-0">
															{{ album.hidden ? 'True' : 'False' }}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div class="col-lg-4">
									<div class="card-profile-stats justify-content-center">
										<div :class="`card card-stats ${$colorMode.value === 'dark' ? 'bg-primary' : '' }`">
											<div class="card-body">
												<div class="row">
													<div class="col-auto">
														<div class="icon icon-shape icon-shape-red">
															<i class="bx bx-calendar" />
														</div>
													</div>
													<div class="col">
														<h5 class="card-title text-uppercase text-muted mb-0">
															NSFW
														</h5>
														<span class="h4 fw-bold mb-0">
															{{ album.nsfw ? 'True' : 'False' }}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12">
					<Table
						title="images"
						:columns="table.columns"
						:url="`/api/albums/${album.id}`"
						url-query="?includeImages=true"
						data-prop="images.data"
						:pagination="{ prop: 'images' }"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	components: {
		FolderOpenIcon: () => import('~/assets/icons/folder-open.svg?inline')
	},
	async asyncData({ params, $axios }) {
		const album = await $axios.$get(`/api/albums/${params.id}`)

		return {
			album
		}
	},
	data({ $store }) {
		return {
			user: $store.state.auth.user,
			album: {},
			table: {
				columns: [
					{
						label: 'Name',
						prop: 'name',
						cellOptions: {
							link: true,
							image: true
						}
					},
					{
						label: 'Type',
						prop: 'type'
					},
					{
						label: 'Size',
						prop: 'size'
					},
					{
						label: 'Created On',
						prop: 'createdAt'
					},
					{
						label: 'Modified On',
						prop: 'modifiedAt'
					}
				]
			}
		}
	}
}
</script>
