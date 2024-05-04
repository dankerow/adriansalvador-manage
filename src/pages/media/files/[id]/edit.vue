<script setup lang="ts">
import { useFilesStore } from '@/stores/files'

const colorMode = useColorMode()
const router = useRouter()
const route = useRoute()
const filesStore = useFilesStore()

const { data: file, error } = await useAsyncData(`file-${route.params.id}`, () => filesStore.getFile(route.params.id, { includeAlbum: true }))

if (!file.value || error.value) {
  throw createError({ statusCode: 404, message: 'The file you are looking for couldn\'t be found.' })
}

useHead({
  title: `${file.value.album?.name} / ${file.value.name}`,
  meta: [
    {
      name: 'description',
      content: `${file.value.album?.name} / ${file.value.name}`
    }
  ]
})

const form = reactive({
  name: file.value.name
})

const errors = ref()

const submitForm = async (event: Event) => {
  if (errors.value) {
    errors.value = null
  }

  const { error } = await filesStore.updateFile(route.params.id, form)

  if (error) {
    errors.value = error
  } else {
    event.target?.reset()
  }
}
</script>

<template>
  <div class="container-fluid">
    <div
      class="card"
      :class="{ 'bg-darker': colorMode.value === 'dark' }"
    >
      <form id="addAlbumForm" method="post" role="form" @submit.prevent="submitForm">
        <div class="card-header">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <h5 class="fw-bold text-white mb-0">
                Editing file
              </h5>
            </div>

            <div class="col-lg-4 text-end">
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
            File information
          </h6>

          <div class="pl-lg-4">
            <div class="row">
              <div class="col-lg-4">
                <div class="form-group">
                  <label class="form-label" for="name">
                    Name
                  </label>

                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    name="name"
                    class="form-control"
                    placeholder="File name"
                    required
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
