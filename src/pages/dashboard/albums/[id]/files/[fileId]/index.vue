<script setup lang="ts">
import { useAlbumsStore } from '@/stores/albums'

const colorMode = useColorMode()
const route = useRoute()
const albumsStore = useAlbumsStore()

const { data: file, error } = await albumsStore.getFile(route.params.fileId)

if (error) {
	return navigateTo('/albums')
}

const deleteFile = async () => {
	const { error } = await albumsStore.deleteFile(route.params.fileId)

	if (error) {
		return console.error(error)
	}

	return navigateTo(`/albums/${route.params.id}`)
}
</script>

<template>
	<div>
		<Banner
			:title="`Albums / ${file.album.name} / ${file.name}`"
			icon="ic:twotone-folder"
			:buttons="[
				{ name: 'delete', text: 'Delete', callback: deleteFile },
				{ name: 'edit', text: 'Edit', url: `/albums/${route.params.id}/files/${route.params.fileId}/edit` },
			]"
		/>

		<div class="container-fluid mt-n4">
			<div class="row justify-content-center">
				<div class="col-lg-12">
					<div
						class="card mb-5"
						:class="{ 'bg-dark': colorMode.value === 'dark' }"
					>
						<div class="card-header">
							<h3 class="mb-0">
								{{ file.name }}
							</h3>
						</div>

						<div class="card-body">
							<div class="row">
								<div class="col-lg-4">
									<CardsStats title="type" :description="file.type" :icon="{ name: 'ph:image-duotone', color: 'blue' }" />
								</div>

								<div class="col-lg-4">
									<CardsStats title="size" :description="file.size" :icon="{ name: 'ic:twotone-disabled-visible', color: 'green' }" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
