<script setup lang="ts">
import type { Album } from '@/types/album'

import { useAlbumsStore } from '@/stores/albums'

const { addToast } = useToast()
const route = useRoute()
const albumsStore = useAlbumsStore()

const album: Album | undefined = albumsStore.albums.find(album => album.id === route.params.id) || await albumsStore.getAlbum(route.params.id)

if (!album) {
  throw createError({ statusCode: 404, message: 'The album you are looking for couldn\'t be found.' })
}

const publish = async () => {
  try {
    await albumsStore.publishAlbum(album.id)

    addToast({
      title: 'Notification',
      body: `The album (${album.name}) was successfully published.`
    })
  } catch (error) {
    addToast({
      title: 'Error',
      body: `The album (${album.name}) couldn't be published.`
    })
  }
}

const unpublish = async () => {
  try {
    await albumsStore.unpublishAlbum(album.id)

    addToast({
      title: 'Notification',
      body: `The album (${album.name}) was successfully unpublished.`
    })
  } catch (error) {
    addToast({
      title: 'Error',
      body: `The album (${album.name}) couldn't be unpublished.`
    })
  }
}

const deleteAlbum = async () => {
  try {
    await albumsStore.deleteAlbum(album.id)

    addToast({
      title: 'Notification',
      body: `The album (${album.name}) was successfully deleted.`
    })
  } catch (error) {
    addToast({
      title: 'Error',
      body: `The album (${album.name}) couldn't be deleted.`
    })
  }
}

const isRootPath = computedEager(() => route.name?.startsWith('albums-id') && !route.name?.includes('files'))
</script>

<template>
  <div>
    <Banner
      v-if="isRootPath"
      :title="album.name"
      icon="ic:twotone-folder"
      :links="[{ name: 'Albums', path: '/albums' }, { name: album.name, path: `/albums/${album.id}` }]"
      :buttons="[
        { name: 'upload', text: 'Upload images', url: `/albums/${album.id}/upload`, icon: 'ic:twotone-upload' },
        { name: 'publish', text: 'Publish', callback: publish, disabled: !album.draft, icon: '' },
        { name: 'unpublish', text: 'Unpublish', callback: unpublish, disabled: album.draft, icon: '' },
        { name: 'edit', text: 'Edit', url: `/albums/${album.id}/edit`, icon: 'ic:twotone-edit' },
        { name: 'delete', text: 'Delete', callback: deleteAlbum, icon: 'ic:twotone-delete' }
      ]"
    />

    <NuxtPage />
  </div>
</template>
