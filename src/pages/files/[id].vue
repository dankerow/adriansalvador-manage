<script setup lang="ts">
import type { Album } from '@/types/album'

import { useFilesStore } from '@/stores/files'

const { addToast } = useToast()
const route = useRoute()
const filesStore = useFilesStore()

const file: Album | undefined = filesStore.files.find(file => file.id === route.params.id) || await filesStore.getFile(route.params.id)

if (!file) {
  throw createError({ statusCode: 404, message: 'The file you are looking for couldn\'t be found.' })
}

const deleteFile = async () => {
  try {
    await filesStore.deleteFile(file.id)

    addToast({
      title: 'Notification',
      body: `The file (${file.name}) was successfully deleted.`
    })
  } catch (error) {
    addToast({
      title: 'Error',
      body: `The file (${file.name}) couldn't be deleted.`
    })
  }
}

const isRootPath = computedEager(() => route.name?.startsWith('files-id'))
</script>

<template>
  <div>
    <Banner
      v-if="isRootPath"
      :title="file.name"
      icon="ph:images-duotone"
      :links="[{ name: 'Files', path: '/files' }, { name: file.name, path: `/files/${file.id}` }]"
      :buttons="[
        { name: 'edit', text: 'Edit', url: `/files/${file.id}/edit`, icon: 'ic:twotone-edit' },
        { name: 'delete', text: 'Delete', callback: deleteFile, icon: 'ic:twotone-delete' }
      ]"
    />

    <NuxtPage />
  </div>
</template>
