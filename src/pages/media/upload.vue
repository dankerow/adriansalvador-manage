<script setup lang="ts">
import { useAlbumsStore } from '@/stores/albums'
import { useAuthStore } from '@/stores/auth'

import vueFilePond from 'vue-filepond'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

const router = useRouter()
const cdnBaseUrl = useRuntimeConfig().public.cdnBaseUrl
const authStore = useAuthStore()
const albumStore = useAlbumsStore()

const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType
)

const pond = ref()
const albumId = ref('')

watch(albumId, (newAlbumId) => {
  pond.value._pond.server.url = `${cdnBaseUrl}/files/upload?albumId=${newAlbumId}`
})

onMounted(() => {
  pond.value._pond.setOptions({
    required: true,
    server: {
      url: `${cdnBaseUrl}/files/upload`,
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    }
  })
})
</script>

<template>
  <div>
    <Banner
      title="Files Upload"
      :links="[
        { name: 'media', text: 'Media', path: '/media' },
        { name: 'upload', text: 'Upload files' }
      ]"
    />

    <div class="container-fluid">
      <div class="card">
        <form id="uploadFilesForm" method="post" role="form">
          <div class="card-header">
            <div class="row align-items-center">
              <div class="col-lg-8">
                <h6 class="fw-bold text-white mb-0">
                  Upload files
                </h6>
              </div>

              <div class="col-lg-auto ms-auto">
                <select v-model="albumId" name="albumId" class="form-select form-select-sm" aria-label="Album Selection Menu">
                  <option disabled selected value="">
                    Select an album
                  </option>

                  <option v-for="album in albumStore.albums" :key="album._id" :value="album._id">
                    {{ album.name }}
                  </option>
                </select>
              </div>

              <div class="col-lg-auto">
                <button class="btn btn-sm btn-secondary" type="button" @click.prevent="router.back()">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div class="card-body">
            <FilePond
              ref="pond"
              name="file-upload"
              :allow-multiple="true"
              :check-validity="true"
              accepted-file-types="image/jpeg, image/png"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
