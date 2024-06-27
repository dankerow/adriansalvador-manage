<script setup lang="ts">
import type { AlbumFile } from '@/types/album'
import type { File } from '@/types/file'

import { useFilesStore } from '@/stores/files'
import { useAlbumsStore } from '@/stores/albums'

const { addToast } = useToast()
const route = useRoute()
const filesStore = useFilesStore()
const albumsStore = useAlbumsStore()

const { data: file, error } = await useAsyncData<File | AlbumFile | null>(
    `file-${route.params.id}`,
    () => filesStore.getFile(route.params.id, { includeAlbum: true }),
    {
      default: () => filesStore.files.find(file => file._id === route.params.id) || null
    }
)

if (!file.value || error.value) {
  throw createError({ statusCode: 404, message: 'The file you are looking for couldn\'t be found.' })
}

const { data: albumFiles } = await useAsyncData(
  `file-${route.params.id}-album-files`,
  () => albumsStore.getAlbumFiles(file.value!.albumId!, -1),
  {
    immediate: file.value!.albumId !== undefined,
    default: () => ref({ images: [], count: 0, pages: 0 }),
    lazy: true,
    deep: false
  }
)

const isRootPath = computedEager(() => route.name?.startsWith('media-files-id'))

const deleteFile = async () => {
  try {
    await filesStore.deleteFile(file.value!._id)

    addToast({
      title: 'Notification',
      body: `The file (${file.value!.name}) was successfully deleted.`
    })
  } catch (error) {
    addToast({
      title: 'Error',
      body: `The file (${file.value!.name}) couldn't be deleted.`
    })
  }
}

const previousFile = async () => {
  if (file.value!.albumId) {
    const index = albumFiles.value.images.findIndex((albumFile: AlbumFile) => albumFile._id === file.value!._id)

    if (index !== undefined && index > 0) {
      const previousFile = albumFiles.value.images[index - 1]

      await navigateTo(`/media/files/${previousFile._id}`)
    }
  }
}

const nextFile = async () => {
  if (file.value!.albumId) {
    const index = albumFiles.value.images.findIndex((albumFile: AlbumFile) => albumFile._id === file.value!._id)

    if (index !== undefined && index < albumFiles.value.images.length - 1) {
      const nextFile = albumFiles.value.images[index + 1]

      await navigateTo(`/media/files/${nextFile._id}`)
    }
  }
}

const hasPreviousFile = computed(() => file.value!.albumId && albumFiles.value.images.findIndex((albumFile: AlbumFile) => albumFile._id === file.value!._id) > 0)
const hasNextFile = computed(() => file.value!.albumId && albumFiles.value.images.findIndex((albumFile: AlbumFile) => albumFile._id === file.value!._id) < albumFiles.value.images.length - 1)
</script>

<template>
  <div>
    <Banner
      v-if="isRootPath"
      :title="file!.name"
      :links="[
        { name: 'Media', path: '/media' },
        ...file!.albumId ? [
          { name: 'Albums' },
          { name: file!.album?.name, path: `/media/albums/${file!.albumId}` }
        ] : [],
        { name: 'Files' },
        { name: file!.name }
      ]"
      :buttons="[
        ...!route.name.startsWith('media-files-id-edit') ? [{ name: 'edit', text: 'Edit', url: `/media/files/${file!._id}/edit`, icon: 'ic:twotone-edit' }] : [],
        { name: 'delete', text: 'Delete', callback: deleteFile, icon: 'ic:twotone-delete' }
      ]"
    />

    <NuxtPage />

    <div class="container-fluid">
      <div
        v-if="file!.album"
        class="d-flex justify-content-between mt-4"
      >
        <div class="col">
          <button
            class="btn btn-link d-inline-flex align-items-center"
            type="button"
            :disabled="!hasPreviousFile"
            @click.prevent="previousFile"
          >
            <Icon name="ic:twotone-keyboard-arrow-left" />

            Previous file in the album
          </button>
        </div>

        <div class="col text-end">
          <button
            class="btn btn-link d-inline-flex align-items-center"
            type="button"
            :disabled="!hasNextFile"
            @click.prevent="nextFile"
          >
            Next file in the album

            <Icon name="ic:twotone-keyboard-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
