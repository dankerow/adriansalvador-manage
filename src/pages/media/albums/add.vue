<script setup lang="ts">
import { useAlbumsStore } from '@/stores/albums'

definePageMeta({
  title: 'Add album'
})

const router = useRouter()
const albumsStore = useAlbumsStore()

const form = reactive({
  name: '',
  nsfw: false,
  hidden: false
})

const errors = ref()

const submitForm = async (event) => {
  if (errors.value) {
    errors.value = null
  }

  try {
    await albumsStore.addAlbum(form)

    event.target.reset()
  } catch (error) {
    errors.value = error
  }
}
</script>

<template>
  <div>
    <Banner
      title="Albums"
      :links="[
        { name: 'media', text: 'Media', path: '/media' },
        { name: 'albums', text: 'Albums' }
      ]"
    />

    <div class="container-fluid">
      <div class="card">
        <form id="addAlbumForm" method="post" role="form" @submit.prevent="submitForm">
          <div class="card-header">
            <div class="row align-items-center">
              <div class="col-lg-8">
                <h6 class="fw-bold text-white mb-0">
                  Add a new album
                </h6>
              </div>

              <div class="col-lg-4 text-end">
                <button class="btn btn-sm btn-secondary" type="button" @click.prevent="router.back()">
                  Cancel
                </button>

                <button class="btn btn-sm btn-primary" type="submit">
                  Add
                </button>
              </div>
            </div>
          </div>

          <div class="card-body">
            <h6 class="text-body-secondary mb-4">
              Album information
            </h6>

            <div class="pl-lg-4">
              <div class="row">
                <div class="col-lg-4">
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
              <div class="row">
                <div class="col-lg-1">
                  <div class="form-group">
                    <div class="form-check">
                      <input id="nsfw" v-model="form.nsfw" class="form-check-input" type="checkbox">

                      <label class="form-check-label" for="nsfw">
                        NSFW
                      </label>
                    </div>
                  </div>
                </div>

                <div class="col-lg-1">
                  <div class="form-group">
                    <div class="form-check">
                      <input id="hidden" v-model="form.hidden" class="form-check-input" type="checkbox">

                      <label class="form-check-label" for="hidden">
                        Hidden
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
</template>
