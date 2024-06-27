<script setup lang="ts">
import type { Album } from '@/types/album'

import { useAlbumsStore } from '@/stores/albums'

const route = useRoute()
const albumsStore = useAlbumsStore()
const { addToast } = useToast()

const { data: album, error } = await useAsyncData<Album | null>(
  `album-${route.params.id}`,
  () => albumsStore.getAlbum(route.params.id),
  {
    default: () => albumsStore.albums.find(album => album._id === route.params.id) || null,
    deep: false
  }
)

if (!album.value || error.value) {
  throw createError({ statusCode: 404, message: 'The album you are looking for couldn\'t be found.' })
}

const publish = async () => {
  try {
    await albumsStore.publishAlbum(album.value!._id)

    addToast({
      title: 'Notification',
      body: `The album (${album.value!.name}) was successfully published.`
    })
  } catch (error) {
    addToast({
      title: 'Error',
      body: `The album (${album.value!.name}) couldn't be published.`
    })
  }
}

const unpublish = async () => {
  try {
    await albumsStore.unpublishAlbum(album.value!._id)

    addToast({
      title: 'Notification',
      body: `The album (${album.value!.name}) was successfully unpublished.`
    })
  } catch (error) {
    addToast({
      title: 'Error',
      body: `The album (${album.value!.name}) couldn't be unpublished.`
    })
  }
}

const deleteAlbum = async () => {
  try {
    await albumsStore.deleteAlbum(album.value!._id)

    addToast({
      title: 'Notification',
      body: `The album (${album.value!.name}) was successfully deleted.`
    })

    await navigateTo('/media')
  } catch (error) {
    addToast({
      title: 'Error',
      body: `The album (${album.value!.name}) couldn't be deleted.`
    })
  }
}
</script>

<template>
  <div>
    <Banner
      :title="album!.name"
      :links="[
        { name: 'Media', path: '/media' },
        { name: 'Albums' },
        { name: album!.name }
      ]"
      :buttons="[
        { name: 'upload', text: 'Upload images', url: `/media/albums/${album!._id}/upload`, icon: 'ic:twotone-upload' },
        { name: 'publish', text: 'Publish', callback: publish, disabled: !album!.draft, icon: '' },
        { name: 'unpublish', text: 'Unpublish', callback: unpublish, disabled: album!.draft, icon: '' },
        ...!route.name.startsWith('media-albums-id-edit') ? [{ name: 'edit', text: 'Edit', url: `/media/albums/${album!._id}/edit`, icon: 'ic:twotone-edit' }] : [],
        { name: 'delete', text: 'Delete', callback: deleteAlbum, icon: 'ic:twotone-delete' }
      ]"
    />

    <NuxtPage />
  </div>
</template>
