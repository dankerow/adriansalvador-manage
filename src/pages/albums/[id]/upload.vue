<script setup lang="ts">
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'

const colorMode = useColorMode()
const router = useRouter()
const route = useRoute()

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

const FilePond = vueFilePond(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType
)
const pond = ref()

const cdnBaseURL = useRuntimeConfig().public.cdnBaseURL

onMounted(() => {
  pond.value._pond.setOptions({
    server: {
      url: `${cdnBaseURL}/albums/${route.params.id}/images/upload`,
      process: {
        headers: {
          Accept: 'application/vnd.adriansalvador.json',
        }
      },
      revert: {
        headers: {
          Accept: 'application/vnd.adriansalvador.json',
        }
      }
    }
  })
})
</script>

<template>
  <div>
    <div class="container-fluid mt-n4">
      <div class="row justify-content-center">
        <div class="col-12">
          <div
            class="card"
            :class="{ 'bg-darker': colorMode.value === 'dark' }"
          >
            <form id="addAlbumForm" method="post" role="form">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col-lg-8">
                    <h3 class="mb-0">
                      Upload to album
                    </h3>
                  </div>

                  <div class="col-lg-4 text-end">
                    <button class="btn btn-sm btn-danger text-bg-danger" type="button" @click.prevent="router.back()">
                      <Icon name="ph:x-square-duotone" />
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
                  accepted-file-types="image/jpeg, image/png"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
