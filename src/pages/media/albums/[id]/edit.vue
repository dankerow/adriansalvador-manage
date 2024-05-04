<script setup lang="ts">
import type { Album } from '@/types/album'

import { useAlbumsStore } from '@/stores/albums'
import { useAuthStore } from '@/stores/auth'

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

const album: Album | undefined = albumsStore.albums.find(album => album._id === route.params.id) || await albumsStore.getAlbum(route.params.id)

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

const getCoverView = computed<string>(() => {
  return album.cover ? `${cdnBaseUrl}/covers/${encodeURIComponent(album.cover.name)}` : album.coverFallback ? `${cdnBaseUrl}/s-files/${encodeURIComponent(album.coverFallback.name)}` : ''
})

onMounted(() => {
  pond.value._pond.setOptions({
    server: {
      url: `${cdnBaseUrl}/albums/${route.params.id}/cover/upload`,
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    }
  })
})
</script>

<template>
  <div class="container-fluid">
    <div class="card">
      <form id="addAlbumForm" method="post" role="form" @submit.prevent="submitForm">
        <div class="card-header">
          <div class="row align-items-center">
            <div class="col-auto">
              <h6 class="fw-bolder text-white mb-0">
                Editing album
              </h6>
            </div>

            <div class="col text-end">
              <button class="btn btn-sm btn-secondary" type="button" @click.prevent="router.back()">
                Cancel
              </button>

              <button class="btn btn-sm btn-primary" type="submit">
                Save
              </button>
            </div>
          </div>
        </div>

        <div class="card-body">
          <h6 class="text-body-secondary mb-4">
            Album information
          </h6>

          <div class="pl-lg-4">
            <div class="row row-cols-2">
              <div class="col-3">
                <label class="form-label">
                  Cover
                </label>

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

          <h6 class="text-body-secondary mb-4">
            More
          </h6>

          <div class="pl-lg-4">
            <div class="row row-cols-1">
              <div class="col">
                <div class="form-group">
                  <div class="form-check">
                    <label class="form-check-label" for="nsfw">
                      Do you want to mark this album as NSFW?
                    </label>

                    <input id="nsfw" v-model="form.nsfw" class="form-check-input" type="checkbox">
                  </div>
                </div>
              </div>

              <div class="col">
                <div class="form-group">
                  <div class="form-check">
                    <label class="form-check-label" for="hidden">
                      Do you want to hide this album?
                    </label>

                    <input id="hidden" v-model="form.hidden" class="form-check-input" type="checkbox">
                  </div>
                </div>
              </div>

              <div class="col">
                <div class="form-group">
                  <div class="form-check">
                    <label class="form-check-label" for="favorite">
                      Do you want to mark this album as favorite?
                    </label>

                    <input id="favorite" v-model="form.favorite" class="form-check-input" type="checkbox">
                  </div>
                </div>
              </div>

              <div class="col">
                <div class="form-group">
                  <div class="form-check">
                    <label class="form-check-label" for="featured">
                      Do you want to mark this album as featured?
                    </label>

                    <input id="featured" v-model="form.featured" class="form-check-input" type="checkbox">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
