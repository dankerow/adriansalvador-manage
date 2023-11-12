<script setup lang="ts">
import type { ComputedRef, Ref } from 'vue'
import type { File } from '@/types/file'

import { useFilesStore } from '@/stores/files'

import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/photoswipe.css'

const route = useRoute()
const filesStore = useFilesStore()
const { addToast } = useToast()
const cdnBaseUrl = useRuntimeConfig().public.cdnBaseUrl

const file: File | undefined = filesStore.files.find(file => file.id === route.params.id) || await filesStore.getFile(route.params.id)

if (!file) {
  throw createError({ statusCode: 404, message: 'The file you are looking for couldn\'t be found.' })
}

const lightbox: Ref<PhotoSwipeLightbox|null> = ref(null)

const rootElement = ref<HTMLElement>()

onMounted(() => {
  if (!lightbox.value) {
    lightbox.value = new PhotoSwipeLightbox({
      gallery: '#previewImage',
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

const getImageView: ComputedRef<string> = computed(() => {
  return `${cdnBaseUrl}/s-files/${encodeURIComponent(file.name)}`
})
</script>

<template>
  <div ref="rootElement">
    <div class="container-fluid mt-n4">
      <div class="row justify-content-center">
        <div class="col-auto">
          <div
            id="previewImage"
            class="card fixed-width fixed-height mb-5"
          >
            <div class="card-header text-center">
              <h3 class="mb-0">
                Preview
              </h3>
            </div>

            <a
              :href="getImageView"
              :data-pswp-width="file.metadata.width"
              :data-pswp-height="file.metadata.height"
              rel="noreferrer"
              aria-label="View image"
            >
              <nuxt-img
                class="img-fluid"
                format="webp"
                :src="getImageView"
                loading="lazy"
                draggable="false"
                :alt="file.name"
              />
            </a>
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
                  <CardsStats title="images" :description="file.type" :icon="{ name: 'ph:image-duotone', color: 'blue' }" />
                </div>

                <div class="col-lg-4">
                  <CardsStats title="hidden" :description="file.size" :icon="{ name: 'ic:twotone-disabled-visible', color: 'green' }" />
                </div>

                <div class="col-lg-4">
                  <CardsStats title="NSFW" :description="file.metadata.height" :icon="{ name: 'ic:twotone-18-up-rating', color: 'red' }" />
                </div>

                <div class="col-lg-4">
                  <CardsStats title="favorite" :description="file.metadata.width" :icon="{ name: 'ic:twotone-18-up-rating', color: 'yellow' }" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  &.fixed-width {
    width: 500px;
  }

  &.fixed-height {
    --bs-card-height: 280px;
  }
}
</style>
