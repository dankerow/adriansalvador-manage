<script setup lang="ts">
import type { Album } from '@/types/Album'

import { useAlbumsStore } from '@/stores/albums'

const { addToast } = useToast()
const route = useRoute()
const albumsStore = useAlbumsStore()

const album: Album = albumsStore.albums.find(album => album.id === route.params.id) || await albumsStore.getAlbum(route.params.id)

if (!album) {
  throw createError({ statusCode: 404, message: 'The album you are looking for couldn\'t be found.' })
}

const deleteAlbum = async () => {
  const { error } = await albumsStore.deleteAlbum(album.id)

  if (!error) {
    addToast({
      title: 'Notification',
      body: `The album (${album.name}) was successfully deleted.`
    })

    return navigateTo('/albums')
  }
}

const isRootPath = computedEager(() => route.name?.startsWith('albums-id') && !route.name?.includes('files'))
</script>

<template>
  <div>
    <Banner
      v-if="isRootPath"
      :links="[{ name: 'Albums', path: '/albums' }, { name: album.name, path: `/albums/${album.id}` }]"
      icon="ic:twotone-folder"
      :buttons="[
        { name: 'upload', text: 'Upload images', url: `/albums/${album.id}/upload`, icon: 'ic:twotone-upload' },
        { name: 'edit', text: 'Edit', url: `/albums/${album.id}/edit`, icon: 'ic:twotone-edit' },
        { name: 'delete', text: 'Delete', callback: deleteAlbum, icon: 'ic:twotone-delete' }
      ]"
    />

    <NuxtPage />
  </div>
</template>
