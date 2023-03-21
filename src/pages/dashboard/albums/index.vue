<script setup lang="ts">
import { useAlbumsStore } from '@/stores/albums'

const albumsStore = useAlbumsStore()

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

const albums = ref(albumsStore.albums)
const loading = ref(albumsStore.loading)
const count = ref(albumsStore.count)
const pages = ref(albumsStore.pages)

const loadAlbums = async (options?: { limit: number, page: number }) => {
	loading.value = true

	const { data } = await albumsStore.getAlbums(options)
	albums.value = data.albums
	count.value = data.count
	pages.value = data.pages

	loading.value = false
}
</script>

<template>
	<div>
		<Banner title="albums" icon="ic:twotone-folder" :buttons="[{ name: 'newAlbum', text: 'New album', url: '/albums/add' }]" />

		<div class="container-fluid mt-n4">
			<div class="row">
				<div class="col">
					<DataTable title="albums" :loading="loading" :data="albums" :columns="table.columns" :pagination="{ count, pages }" @load-data="loadAlbums" />
				</div>
			</div>
		</div>
	</div>
</template>
