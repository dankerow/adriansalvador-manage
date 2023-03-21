<script setup lang="ts">
import type { Album } from '@/stores/albums'

import { useAlbumsStore } from '@/stores/albums'

const colorMode = useColorMode()
const route = useRoute()
const albumsStore = useAlbumsStore()

const album: Album = albumsStore.albums.find(album => album.id === route.params.id) || (await albumsStore.getAlbum(route.params.id)).data
const images = await albumsStore.getAlbumFiles(album.id, -1)

const table = ref({
	columns: [
		{
			label: 'Name',
			prop: 'name',
			sortable: true,
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
			prop: 'createdAt',
			sortable: true
		},
		{
			label: 'Modified On',
			prop: 'modifiedAt',
			sortable: true
		}
	]
})
</script>

<template>
	<div>
		<Banner :title="`Albums / ${album.name}`" icon="ic:twotone-folder" :buttons="[{ name: 'upload', text: 'Upload images', url: `/albums/${album.id}/upload` }, { name: 'edit', text: 'Edit', url: `/albums/${album.id}/edit` }]" />

		<div class="container-fluid mt-n4">
			<div class="row justify-content-center">
				<div class="col-lg-12">
					<div
						class="card mb-5"
						:class="{ 'bg-dark': colorMode.value === 'dark' }"
					>
						<div class="card-header text-center">
							<h3 class="mb-0">
								{{ album.name }}
							</h3>
						</div>

						<div class="card-body">
							<div class="row g-4">
								<div class="col-lg-4">
									<CardsStats title="images" :description="album.fileCount" :icon="{ name: 'ph:image-duotone', color: 'blue' }" />
								</div>

								<div class="col-lg-4">
									<CardsStats title="hidden" :description="album.hidden" :icon="{ name: 'ic:twotone-disabled-visible', color: 'green' }" />
								</div>

								<div class="col-lg-4">
									<CardsStats title="NSFW" :description="album.nsfw" :icon="{ name: 'ic:twotone-18-up-rating', color: 'red' }" />
								</div>

								<div class="col-lg-4">
									<CardsStats title="favorite" :description="album.favorite" :icon="{ name: 'ic:twotone-18-up-rating', color: 'yellow' }" />
								</div>

								<div class="col-lg-4">
									<CardsStats title="featured" :description="album.featured" :icon="{ name: 'ic:twotone-18-up-rating', color: 'black' }" />
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12">
					<DataTable
						title="images"
						:columns="table.columns"
						:sticky-header="true"
						:data="images.data"
						:pagination="{ count: images.count, pages: images.pages }"
						:download="{ excel: true }"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
