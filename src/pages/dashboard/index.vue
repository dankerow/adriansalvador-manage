<script setup lang="ts">
import { useAlbumsStore } from '@/stores/albums'
import { useAnalyticsStore } from '~/stores/analytics'

const colorMode = useColorMode()
const albumsStore = useAlbumsStore()
const analyticsStore = useAnalyticsStore()

const audits = ref([])

const table = ref({
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
			label: 'Favorite',
			prop: 'favorite'
		},
		{
			label: 'Featured',
			prop: 'featured'
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
})

if (albumsStore.albums.length === 0) {
	await albumsStore.getAlbums()
}

const data = await analyticsStore.fetchAnalytics()
const pageViews = data.pageViews

const albums = ref({
	loading: albumsStore.loading,
	data: albumsStore.albums,
	count: albumsStore.count,
	pages: albumsStore.pages
})
</script>

<template>
	<div>
		<Banner title="dashboard" icon="ic:twotone-home" :body="{ class: 'row row-cols-1 row-cols-lg-4 mt-4' }">
			<template #body>
				<div class="col">
					<CardsStats title="Albums" :description="albums.count" :icon="{ name: 'ic:twotone-photo-album', color: 'red', url: '/albums' }" />
				</div>

				<div class="col">
					<CardsStats title="Images" :description="4536" :icon="{ name: 'ph:image-duotone', color: 'blue', url: '/albums' }" />
				</div>

				<div class="col">
					<CardsStats title="Views" :description="pageViews" :icon="{ name: 'ph:eye-duotone', color: 'indigo', url: '/analytics' }" />
				</div>

				<div class="col">
					<CardsStats title="Downloads" :description="298" :icon="{ name: 'ph:file-arrow-down-duotone', color: 'orange', url: '/analytics' }" />
				</div>
			</template>
		</Banner>

		<div class="container-fluid">
			<div class="row row-cols-1 row-cols-lg-2">
				<div class="col col-lg-8 mt-n4">
					<DataTable title="Albums" :loading="albums.loading" :data="albums.data" :columns="table.columns" :pagination="{ count: albums.count, pages: albums.pages }" />
				</div>

				<div class="col col-lg-4 mt-lg-n4">
					<div class="row row-cols-1">
						<div class="col">
							<div
								class="card"
								:class="{ 'bg-darker': colorMode.value === 'dark' }"
							>
								<div class="card-header">
									<div class="row row-cols-2 align-items-center">
										<div class="col">
											<h1 class="h3 mb-0">
												Recent Activities
											</h1>
										</div>

										<div class="col">
											<NuxtLink
												to="/"
												class="btn btn-sm btn-primary float-end"
												:class="{ disabled: !audits.length }"
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
														<Icon name="ic:baseline-add" />
													</div>
												</template>
												<template v-else-if="audit.type === 2">
													<div class="icon icon-sm icon-shape icon-shape-orange shadow-sm">
														<Icon name="ic:baseline-edit" />
													</div>
												</template>
												<template v-else-if="audit.type === 3">
													<div class="icon icon-sm icon-shape icon-shape-red shadow-sm">
														<Icon name="ic:baseline-delete" />
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
