<script setup lang="ts">
import type { AlbumFile } from '@/types/album'
import type { File } from '@/types/file'

import { useFilesStore } from '@/stores/files'

import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/photoswipe.css'

const route = useRoute()
const filesStore = useFilesStore()
const cdnBaseUrl = useRuntimeConfig().public.cdnBaseUrl

const { data: file } = await useAsyncData<File | AlbumFile | null>(
    `file-${route.params.id}`,
    () => filesStore.files.find(file => file._id === route.params.id) || filesStore.getFile(route.params.id, { includeAlbum: true }),
    {
      default: () => null
    }
)

if (!file.value) {
  throw createError({ statusCode: 404, message: 'The file you are looking for couldn\'t be found.' })
}

const lightbox = ref<PhotoSwipeLightbox | null>(null)

const getImageView = computed<string>(() => {
  return `${cdnBaseUrl}/s-files/${encodeURIComponent(file.value!.name)}`
})

onMounted(() => {
  if (!lightbox.value) {
    lightbox.value = new PhotoSwipeLightbox({
      gallery: '#preview-image',
      children: 'a',
      pswpModule: () => import('photoswipe'),
      wheelToZoom: true
    })

    lightbox.value?.init()
  }
})

onUnmounted(() => {
  if (lightbox.value !== null) {
    lightbox.value?.destroy()
    lightbox.value = null
  }
})
</script>

<template>
  <div class="container-fluid">
    <div class="card mb-5">
      <div class="card-body">
        <div class="row row-cols-2 g-4">
          <div id="preview-image" class="col-auto">
            <a
              :href="getImageView"
              :data-pswp-width="file!.metadata.width"
              :data-pswp-height="file!.metadata.height"
              rel="noreferrer"
              aria-label="View image"
            >
              <nuxt-img
                class="img-fluid rounded"
                format="webp"
                :src="getImageView"
                :width="300"
                loading="lazy"
                decode="async"
                draggable="false"
                :alt="file!.name"
              />
            </a>
          </div>

          <div class="col-lg-4">
            <h6 class="fw-bold mb-0">
              Name
            </h6>

            <p class="text-body-secondary">
              {{ file!.name }}
            </p>

            <h6 class="fw-bold mb-0">
              Type
            </h6>

            <p class="text-body-secondary">
              {{ file!.type }}
            </p>

            <h6 class="fw-bold mb-0">
              Size
            </h6>

            <p class="text-body-secondary">
              {{ file!.size }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
