<script setup lang="ts">
import type { FilterOptions } from '@/types'

import { useFilesStore } from '@/stores/files'
import { useAlbumsStore } from '@/stores/albums'
import { useAnalyticsStore } from '@/stores/analytics'

const filesStore = useFilesStore()
const albumsStore = useAlbumsStore()
const analyticsStore = useAnalyticsStore()

const tableFiles = {
  columns: [
    {
      label: 'Name',
      prop: 'name'
    },
    {
      label: 'Album',
      prop: 'album'
    }
  ]
}

const tableAlbums = {
  columns: [
    {
      label: 'Name',
      prop: 'name'
    },
    {
      label: 'File Count',
      prop: 'fileCount'
    },
    {
      label: 'Hidden',
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
    }
  ]
}

const loadFiles = async (options?: FilterOptions) => {
  await filesStore.getFiles({ includeAlbum: true, ...options })
}

const loadAlbums = async (options?: FilterOptions) => {
 await albumsStore.getAlbums(options)
}

onMounted(async () => {
  await analyticsStore.fetchAnalytics()
})
</script>

<template>
  <div>
    <Banner title="Dashboard" />

    <div class="container-fluid">
      <div class="row row-cols-1 row-cols-lg-4 mb-4">
        <div class="col">
          <CardsStats title="Files" :description="filesStore.count" :icon="{ name: 'ph:image-duotone', color: 'blue', url: '/media' }" />
        </div>

        <div class="col">
          <CardsStats title="Albums" :description="albumsStore.count" :icon="{ name: 'ic:twotone-photo-album', color: 'red', url: '/media' }" />
        </div>

        <div class="col">
          <CardsStats title="Views" :description="analyticsStore.pageViews" :icon="{ name: 'ph:eye-duotone', color: 'indigo', url: '/analytics' }" />
        </div>

        <div class="col">
          <CardsStats title="Downloads" :description="298" :icon="{ name: 'ph:file-arrow-down-duotone', color: 'orange', url: '/analytics' }" />
        </div>
      </div>

      <div class="row row-cols-1 row-cols-lg-2">
        <div class="col col-lg-6">
          <DataTable
            title="Files"
            :data="filesStore.files"
            :columns="tableFiles.columns"
            :pagination="{
              count: filesStore.count,
              pages: filesStore.pages
            }"
            @load-data="loadFiles"
          >
            <template #item-name="{ item, column }">
              <NuxtLink :to="`/media/files/${item._id}`">
                {{ item[column.prop] }}
              </NuxtLink>
            </template>

            <template #item-album="{ item, column }">
              <NuxtLink v-if="item[column.prop]" :to="`/media/albums/${item.album._id}`">
                {{ item.album.name }}
              </NuxtLink>

              <span v-else>
                No album
              </span>
            </template>
          </DataTable>
        </div>

        <div class="col col-lg-6">
          <DataTable
            title="Albums"
            :data="albumsStore.albums"
            :columns="tableAlbums.columns"
            :pagination="{
              count: albumsStore.count,
              pages: albumsStore.pages
            }"
            @load-data="loadAlbums"
          >
            <template #item-name="{ item, column }">
              <NuxtLink :to="`/media/albums/${item._id}`">
                {{ item[column.prop] }}
              </NuxtLink>
            </template>

            <template #item-hidden="{ item, column }">
              <span v-if="item[column.prop]">
                <Icon name="ph:eye-slash-duotone" />
              </span>

              <span v-else>
                <Icon name="ph:eye-duotone" class="opacity-50" />
              </span>
            </template>

            <template #item-nsfw="{ item, column }">
              <span v-if="item[column.prop]">
                <Icon name="ph:check-square-duotone" />
              </span>

              <span v-else>
                <Icon name="ph:x-square-duotone" class="opacity-50" />
              </span>
            </template>

            <template #item-favorite="{ item, column }">
              <span v-if="item[column.prop]">
                <Icon name="ph:star-fill" />
              </span>

              <span v-else>
                <Icon name="ph:star-duotone" class="opacity-50" />
              </span>
            </template>

            <template #item-featured="{ item, column }">
              <span v-if="item[column.prop]">
                <Icon name="ph:star-fill" />
              </span>

              <span v-else>
                <Icon name="ph:star-duotone" class="opacity-50" />
              </span>
            </template>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>
