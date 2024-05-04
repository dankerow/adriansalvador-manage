<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import vueFilePond from 'vue-filepond'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

const cdnBaseUrl = useRuntimeConfig().public.cdnBaseUrl
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType
)
const pond = ref()

onMounted(() => {
  pond.value._pond.setOptions({
    server: {
      url: `${cdnBaseUrl}/files/upload?albumId=${route.params.id}`,
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
      <form id="addAlbumForm" method="post" role="form">
        <div class="card-header">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <h6 class="fw-bold text-white mb-0">
                Upload to album
              </h6>
            </div>

            <div class="col-lg-4 text-end">
              <button class="btn btn-sm btn-secondary" type="button" @click.prevent="router.back()">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div class="card-body">
          <FilePond
            ref="pond"
            :name="route.params.id"
            :allow-multiple="true"
            :check-validity="true"
            accepted-file-types="image/jpeg, image/png"
          />
        </div>
      </form>
    </div>
  </div>
</template>
