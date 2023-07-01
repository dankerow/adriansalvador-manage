<script setup lang="ts">
import type { ComputedRef, Ref } from 'vue'
import type { Album, AlbumFile } from '@/types/album'

import { useAlbumsStore } from '@/stores/albums'

const route = useRoute()
const albumsStore = useAlbumsStore()
const { addToast } = useToast()
const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL

const album: Album | undefined = albumsStore.albums.find(album => album.id === route.params.id) || await albumsStore.getAlbum(route.params.id)

if (!album) {
  throw createError({ statusCode: 404, message: 'The album you are looking for couldn\'t be found.' })
}

const { pending: loadingImages, data: imageData, refresh } = await useAsyncData(() => albumsStore.getAlbumFiles(album.id, -1), { default: () => ref({ images: [], count: 0, pages: 0 }), lazy: true, server: false })
const imageCount: Ref<number> = ref(imageData.value?.count ?? 0)
const imagesPages: Ref<number> = ref(imageData.value?.pages ?? 0)

const tableImages = ref({
  columns: [
    {
      label: 'Name',
      prop: 'name'
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
      prop: 'createdAt'
    },
    {
      label: 'Modified On',
      prop: 'modifiedAt'
    }
  ]
})

const dataTable = ref()

const deleteSelectedImages = async () => {
  const selectedRows = getSelectedRows.value

  if (selectedRows.length === 0) {
    return
  }

  const ids = selectedRows.map((row: any) => row.id)

  try {
    await albumsStore.deleteFiles(ids)
    dataTable.value?.deselectAllRows()

    await refresh()
  } catch (error) {
    addToast({
      title: 'Error',
      body: error
    })
  }
}

const getSelectedRows = computed(() => {
  return dataTable.value?.selectedRows
})

const getImagesView: ComputedRef<AlbumFile[]> = computed(() => {
  return imageData.value?.images.map((image: any) => {
    image.url = `${cdnBaseURL}/gallery/${encodeURIComponent(album.name)}/${encodeURIComponent(image.name)}`

    return image
  })
})

const getCoverView: ComputedRef<string> = computed(() => {
  return album.cover ? `${cdnBaseURL}/covers/${encodeURIComponent(album.cover.name)}` : album.coverFallback ? `${cdnBaseURL}/gallery/${encodeURIComponent(album.name)}/${encodeURIComponent(album.coverFallback.name)}` : ''
})
</script>

<template>
  <div>
    <div class="container-fluid mt-n4">
      <div class="row justify-content-center">
        <div class="col-auto">
          <div
            class="card fixed-height mb-5"
          >
            <nuxt-img
              class="image-thumbnail img-fluid rounded"
              :src="getCoverView"
              :width="500"
              :height="280"
              fit="cover"
              format="webp"
              loading="lazy"
              draggable="false"
              alt=""
            />
          </div>
        </div>
        <div class="col">
          <div class="card fixed-height mb-5">
            <div class="card-header text-center">
              <h3 class="mb-0">
                Properties
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
            ref="dataTable"
            selection
            multiple-selection
            title="images"
            :loading="loadingImages"
            :columns="tableImages.columns"
            :sticky-header="true"
            :data="getImagesView"
            :pagination="{ count: imageCount, pages: imagesPages }"
            :show="{ pagination: false }"
            :buttons="[
              {
                name: 'delete-selected-images',
                text: 'Delete Selected Images',
                icon: 'ic:twotone-delete',
                disabled: !getSelectedRows?.length,
                callback: deleteSelectedImages
              }
            ]"
            @load-data="refresh"
          >
            <template #item-name="{ item, column }">
              <NuxtLink :to="`/albums/${album.id}/files/${item.id}`">
                <nuxt-img :src="item.url" :width="32" :height="32" fit="cover" format="webp" loading="lazy" class="me-2" :alt="item.name" />
                <span>
                  {{ item[column.prop] }}
                </span>
              </NuxtLink>
            </template>

            <template #item-created-on="{ item, column }">
              <NuxtTime :datetime="item[column.prop]" date-style="short" time-style="short" />
            </template>

            <template #item-modified-on="{ item, column }">
              <NuxtTime :datetime="item[column.prop]" date-style="short" time-style="short" />
            </template>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  &.fixed-height {
    --bs-card-height: 280px;
  }
}
</style>
