<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { Album } from '~/types/album'

import { useAuthStore } from '@/stores/auth'
import { useAlbumsStore } from '@/stores/albums'

import { storeToRefs } from 'pinia'
import vueFilePond from 'vue-filepond'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'

const { addToast } = useToast()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const albumsStore = useAlbumsStore()
const cdnBaseUrl = useRuntimeConfig().public.cdnBaseUrl

const { token } = storeToRefs(authStore)

const album: Album | undefined = albumsStore.albums.find(album => album.id === route.params.id) || await albumsStore.getAlbum(route.params.id)

if (!album) {
  throw createError({ statusCode: 404, message: 'The album you are looking for couldn\'t be found.' })
}

const form = reactive({
  name: album.name,
  hidden: album.hidden,
  nsfw: album.nsfw,
  favorite: album.favorite,
  featured: album.featured
})

const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageTransform,
  FilePondPluginImageResize,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageCrop
)
const pond = ref()

const submitForm = async () => {
  try {
    await albumsStore.updateAlbum(route.params.id, form)

    addToast({
      title: 'Notification',
      body: `The album (${album.name}) was successfully updated.`
    })
  } catch (error) {
    addToast({
      title: 'Error',
      body: `The album (${album.name}) could not be updated.`
    })
  }
}

const getCoverView: ComputedRef<string> = computed(() => {
  return album.cover ? `${cdnBaseUrl}/covers/${encodeURIComponent(album.cover.name)}` : album.coverFallback ? `${cdnBaseUrl}/gallery/${encodeURIComponent(album.name)}/${encodeURIComponent(album.coverFallback.name)}` : ''
})

onMounted(() => {
  pond.value._pond.setOptions({
    server: {
      url: `${cdnBaseUrl}/albums/${route.params.id}/cover/upload`,
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    }
  })
})
</script>

<template>
  <div>
    <div class="container-fluid mt-n4">
      <div class="row justify-content-center">
        <div class="col-3">
          <div class="card mb-5">
            <div class="card-header">
              <h2 class="h4 mb-0">
                Cover
              </h2>
            </div>

            <FilePond
              ref="pond"
              :name="`${route.params.id}-cover`"
              :check-validity="true"
              accepted-file-types="image/jpeg, image/png"
              :files="[{
                source: getCoverView
              }]"
              max-file-size="6MB"
              image-resize-target-width="1000"
              style-panel-layout="compact"
              style-load-indicator-position="center bottom"
              style-button-uemove-item-position="center bottom"
            />
          </div>
        </div>
        <div class="col">
          <div class="card">
            <form id="addAlbumForm" method="post" role="form" @submit.prevent="submitForm">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <h3 class="mb-0">
                      Editing album
                    </h3>
                  </div>

                  <div class="col text-end">
                    <button class="btn btn-sm btn-danger text-bg-danger" type="button" @click.prevent="router.back()">
                      <Icon name="ph:x-square-duotone" />
                      Cancel
                    </button>

                    <button class="btn btn-sm btn-success text-bg-success" type="submit">
                      <Icon name="ph:floppy-disk-duotone" />
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <div class="card-body">
                <h4 class="heading-small text-muted mb-4">
                  Album information
                </h4>

                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-auto">
                      <div class="form-group">
                        <label class="form-label" for="name">
                          Name <span style="color: red;">*</span>
                        </label>

                        <input
                          id="name"
                          v-model="form.name"
                          type="text"
                          name="name"
                          class="form-control"
                          placeholder="Album name"
                          required
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <hr class="my-4">

                <h4 class="heading-small text-muted mb-4">
                  More
                </h4>

                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col">
                      <div class="form-group">
                        <div class="form-check">
                          <input id="nsfw" v-model="form.nsfw" class="form-check-input" type="checkbox">
                          <label class="form-check-label" for="nsfw">
                            NSFW
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="form-group">
                        <div class="form-check">
                          <input id="hidden" v-model="form.hidden" class="form-check-input" type="checkbox">
                          <label class="form-check-label" for="hidden">
                            Hidden
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="form-group">
                        <div class="form-check">
                          <input id="favorite" v-model="form.favorite" class="form-check-input" type="checkbox">
                          <label class="form-check-label" for="favorite">
                            Favorite
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="form-group">
                        <div class="form-check">
                          <input id="featured" v-model="form.featured" class="form-check-input" type="checkbox">
                          <label class="form-check-label" for="featured">
                            Featured
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
