<script setup lang="ts">
import { useAlbumsStore } from '@/stores/albums'

const colorMode = useColorMode()
const router = useRouter()
const route = useRoute()
const albumsStore = useAlbumsStore()

const { data: file, error } = await albumsStore.getFile(route.params.id, route.params.fileId)

if (error) {
  await navigateTo('/albums')
}

useHead({
  title: `${file.album?.name} / ${file.name}`,
  meta: [
    {
      name: 'description',
      content: `${file.album?.name} / ${file.name}`
    }
  ]
})

const form = reactive({
  name: file.name,
  type: file.type,
  size: file.size,
  albumId: file.albumId,
  album: file.album
})

const errors = ref()

const submitForm = async (event: Event) => {
  if (errors.value) {
    errors.value = null
  }

  const { error } = await albumsStore.updateFile(route.params.fileId, form)

  if (error) {
    errors.value = error
  } else {
    event.target?.reset()
  }
}
</script>

<template>
  <div>
    <Banner :title="`Albums / ${file.name}`" icon="ic:twotone-folder" />

    <div class="container-fluid mt-n4">
      <div class="row justify-content-center">
        <div class="col">
          <div
            class="card"
            :class="{ 'bg-darker': colorMode.value === 'dark' }"
          >
            <form id="addAlbumForm" method="post" role="form" @submit.prevent="submitForm">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col-lg-8">
                    <h3 class="mb-0">
                      Editing file
                    </h3>
                  </div>

                  <div class="col-lg-4 text-end">
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
                  File information
                </h4>

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

                    <div class="col-lg-4">
                      <div class="form-group">
                        <label class="form-label" for="name">
                          Type
                        </label>

                        <input
                          id="name"
                          v-model="form.type"
                          type="text"
                          name="name"
                          class="form-control"
                          placeholder="File type"
                          readonly
                        >
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="form-group">
                        <label class="form-label" for="name">
                          Size
                        </label>

                        <input
                          id="name"
                          v-model="form.size"
                          type="text"
                          name="name"
                          class="form-control"
                          placeholder="File size"
                          readonly
                        >
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
