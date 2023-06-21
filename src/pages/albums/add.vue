<script setup lang="ts">
import { useAlbumsStore } from '@/stores/albums'

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

  const { error } = await albumsStore.addAlbum(form)

  if (error) {
    errors.value = error
  } else {
    event.target.reset()
  }
}
</script>

<template>
  <div>
    <Banner
      title="Albums"
      icon="ic:twotone-folder"
      :links="[{ name: 'Albums', path: '/albums' }, { name: 'Add' }]"
    />

    <div class="container-fluid mt-n4">
      <div class="row justify-content-center">
        <div class="col">
          <div class="card">
            <form id="addAlbumForm" method="post" role="form" @submit.prevent="submitForm">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col-lg-8">
                    <h3 class="mb-0">
                      Add a new album
                    </h3>
                  </div>

                  <div class="col-lg-4 text-end">
                    <button class="btn btn-sm btn-danger text-bg-danger" type="button" @click.prevent="router.back()">
                      <Icon name="ph:x-square-duotone" />
                      Cancel
                    </button>

                    <button class="btn btn-sm btn-success text-bg-success" type="submit">
                      <Icon name="ph:floppy-disk-duotone" />
                      Add
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

                <h4 class="heading-small text-muted mb-4">
                  More
                </h4>

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
    </div>
  </div>
</template>
