<script setup lang="ts">
import type { Album } from '@/types'

import { useAlbumsStore } from '@/stores/albums'
import { useFilesStore } from '@/stores/files'

useHead({
  title: 'Media',
  meta: [
    {
      name: 'description',
      content: 'Media'
    }
  ]
})

const albumsStore = useAlbumsStore()
const filesStore = useFilesStore()

const currentPage = ref<number>(1)
const aloneFileCount = ref<number>(0)

const { data: albumsData } = await useAsyncData('albums', () => albumsStore.getAlbums({
  page: currentPage.value
}),
{
  default: () => ref({ albums: [], count: 0, pages: 0 }),
  watch: [currentPage],
  deep: false
})

const { data: filesData } = await useAsyncData('files', () => filesStore.getFiles({
  includeAlbum: true,
  page: currentPage.value
}),
{
  default: () => ref({ files: [], count: 0, pages: 0 }),
  watch: [currentPage],
  deep: false
})

const cdnBaseUrl = useRuntimeConfig().public.cdnBaseUrl

const getItems = computed(() => {
  const items = []

  for (const album of albumsData.value.albums) {
    items.push({
      id: album.id,
      name: album.name,
      isAlbum: true,
      url: `/media/albums/${album.id}`,
      cover: album.cover,
      coverFallback: album.coverFallback
    })
  }

  for (const file of filesData.value.files) {
    if (file.album) continue

    items.push({
      id: file.id,
      name: file.name,
      isFile: true,
      url: `${cdnBaseUrl}/s-files/${encodeURIComponent(file.name)}`,
      metadata: {
        width: file.metadata.width,
        height: file.metadata.height
      }
    })

    aloneFileCount.value++
  }

  return items
})

const gridItemCount = computed(() => {
  return albumsData.value.count + aloneFileCount.value
})

const getCoverUrl = (album: Album) => {
  return album.cover ? `${cdnBaseUrl}/covers/${encodeURIComponent(album.cover.name)}` : album.coverFallback ? `${cdnBaseUrl}/s-files/${encodeURIComponent(album.coverFallback.name)}` : ''
}

const changePage = (value: number) => {
  currentPage.value = value
}
</script>

<template>
  <div>
    <Banner
      title="Media"
      :links="[
        { name: 'media', text: 'Media' }
      ]"
      :buttons="[
        { name: 'new-album', text: 'Create album', url: '/media/albums/add', icon: 'ic:twotone-add' },
        { name: 'new-file', text: 'Upload files', url: '/media/upload', icon: 'ic:twotone-add' }
      ]"
    />

    <div class="container-fluid">
      <Grid :items="getItems">
        <template #default="{ item }">
          <div class="card shadow-sm">
            <div class="card-img-top image-container position-relative">
              <div v-if="item.isAlbum" class="d-flex flex-column align-items-center justify-content-center position-absolute z-1 top-0 start-0 end-0 bottom-0 bg-black bg-opacity-50">
                <Icon
                  name="ic:twotone-folder"
                  class="text-white"
                  size="2.5em"
                />
              </div>

              <NuxtImg
                v-if="item.isAlbum"
                :src="getCoverUrl(item)"
                format="webp"
                width="350"
                height="120"
                fit="cover"
                loading="lazy"
                decode="async"
                :alt="`${item.name}'s cover`"
              />

              <NuxtImg
                v-else-if="item.isFile"
                format="webp"
                :src="item.url"
                width="350"
                height="120"
                fit="cover"
                loading="lazy"
                decode="async"
                :alt="`${item.name}'s thumbnail`"
              />
            </div>

            <div class="card-footer">
              <span class="d-block fs-6 fw-bold text-truncate">
                {{ item.name }}
              </span>
            </div>

            <NuxtLink
              v-if="item.isAlbum"
              :to="`/media/albums/${item.id}`"
              class="stretched-link"
            />
          </div>
        </template>
      </Grid>

      <div class="row row-cols-2 align-items-center">
        <div class="col-sm-12 col-md-6">
          Showing {{ getItems.length }} of {{ gridItemCount }} entr{{ gridItemCount > 1 ? 'ies' : 'y' }}
        </div>

        <div class="col-sm-12 col-md-6">
          <Pagination
            class="float-end"
            :current-page="currentPage"
            :pages="Math.ceil(gridItemCount / 25)"
            @change-page="changePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-container {
  background: rgb(24, 24, 24);
  height: 120px;
  position: relative;
  overflow: hidden;

  img {
    image-rendering: crisp-edges;
    transition: transform .3s ease-in-out;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: scale(1) translate(-50%, -50%);
  }
}
</style>
