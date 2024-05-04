<script setup lang="ts">
import type { Album, AlbumFile } from '@/types/album'

import { useAlbumsStore } from '@/stores/albums'

const route = useRoute()
const albumsStore = useAlbumsStore()
const cdnBaseUrl = useRuntimeConfig().public.cdnBaseUrl

const { data: album, error } = await useAsyncData<Album | null>(
    `album-${route.params.id}`,
    () => albumsStore.getAlbum(route.params.id),
    {
      default: () => albumsStore.albums.find(album => album._id === route.params.id) || null
    }
)

if (!album.value || error.value) {
  throw createError({ statusCode: 404, message: 'The album you are looking for couldn\'t be found.' })
}

useHead({
  title: album.value.name,
  meta: [
    {
      name: 'description',
      content: album.value.name
    }
  ]
})

const { data: imageData } = await useAsyncData(
  () => albumsStore.getAlbumFiles(album.value!._id, -1),
  {
    default: () => ref({ images: [], count: 0, pages: 0 }),
    deep: false,
    lazy: true
  }
)

const getImagesView = computed<AlbumFile[]>(() => {
  return imageData.value?.images.map((image) => {
    image.url = `${cdnBaseUrl}/s-files/${encodeURIComponent(image.name)}`

    return image
  })
})

const getCoverView = computed<string>(() => {
  return album.value!.cover ? `${cdnBaseUrl}/covers/${encodeURIComponent(album.value!.cover.name)}` : album.value!.coverFallback ? `${cdnBaseUrl}/s-files/${encodeURIComponent(album.value!.coverFallback.name)}` : ''
})

const hasCover = computed<boolean>(() => {
  return !!album.value!.cover || !!album.value!.coverFallback
})
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div v-if="hasCover" class="col-12 col-md-auto">
        <nuxt-img
          format="webp"
          :src="getCoverView"
          :width="350"
          :height="200"
          fit="cover"
          class="image-thumbnail img-fluid rounded"
          loading="lazy"
          decoding="async"
          draggable="false"
          alt="Album cover"
        />
      </div>

      <div class="col-12 col-md-auto">
        <h4 class="fw-bold text-white">
          {{ album!.name }}
        </h4>

        <p class="information">
          {{ album!.fileCount }} file{{ album!.fileCount === 1 ? '' : 's' }}
        </p>
      </div>
    </div>

    <hr class="my-5">

    <div class="row justify-content-center">
      <div class="col">
        <h5 class="fw-bolder text-white mb-4">
          Properties
        </h5>

        <div class="row row-cols-2 g-4">
          <div class="col">
            <h6 class="fw-bold text-white">
              Visibility
            </h6>

            <p>
              {{ album!.hidden ? 'This album is currently hidden, which means, its media and the album itself won\'t be displayed on the portfolio' : 'This album and its media are currently visible on the portfolio' }}
            </p>
          </div>

          <div class="col">
            <h6 class="fw-bold text-white">
              NSFW
            </h6>

            <p>
              {{ album!.nsfw ? 'This album is marked as NSFW, which means, its media and the album itself will be displayed with a warning' : 'This album is not marked as NSFW' }}
            </p>
          </div>

          <div class="col">
            <h6 class="fw-bold text-white">
              Favorite
            </h6>

            <p>
              {{ album!.favorite ? 'This album is marked as favorite' : 'This album is not marked as favorite' }}
            </p>
          </div>

          <div class="col">
            <h6 class="fw-bold text-white">
              Featured
            </h6>

            <p>
              {{ album!.featured ? 'This album is marked as featured' : 'This album is not marked as featured' }}
            </p>
          </div>
        </div>

        <hr class="my-5">
      </div>

      <div class="col-12">
        <h5 class="fw-bolder text-white mb-4">
          Images
        </h5>

        <Grid :items="getImagesView">
          <template #default="{ item }">
            <div class="card shadow-sm">
              <div class="card-img-top image-container position-relative">
                <NuxtImg
                  format="webp"
                  :src="item.url"
                  width="350"
                  height="200"
                  fit="cover"
                  loading="lazy"
                  decoding="async"
                  :alt="`${item.name}'s thumbnail`"
                />
              </div>

              <div class="card-footer">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <div class="fw-bold">
                      {{ item.name }}
                    </div>
                  </div>
                </div>
              </div>

              <NuxtLink
                :to="`/media/files/${item._id}`"
                class="stretched-link"
              />
            </div>
          </template>
        </grid>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-container {
  background: rgb(24, 24, 24);
  height: 200px;
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
