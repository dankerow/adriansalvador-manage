<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const { user } = storeToRefs(authStore)

const form = reactive({
  firstName: user.value?.firstName,
  lastName: user.value?.lastName,
  email: user.value?.email
})

const errors = ref()

const submitForm = async (event: Event) => {
  if (errors.value) {
    errors.value = null
  }

  const { error } = await authStore.updateUser(form)

  if (error) {
    errors.value = error
  } else {
    (event.target as HTMLFormElement).reset()
  }
}
</script>

<template>
  <div>
    <Banner
      :links="[
        { name: 'Settings' }
      ]"
    />

    <div class="container-fluid mt-n4">
      <div class="row justify-content-center">
        <div class="col-lg-12">
          <div class="card mb-5">
            <form id="addUserForm" method="post" role="form" @submit.prevent="submitForm">
              <div class="card-header">
                <div class="row align-items-center">
                  <div class="col-lg-8">
                    <h3 class="mb-0">
                      Edit your settings
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
                <div v-if="errors" class="alert alert-danger">
                  {{ errors.message ? errors.message : errors }}
                </div>

                <h4 class="heading-small text-muted mb-4">
                  User information
                </h4>

                <div class="pl-lg-4">
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-label" for="firstName">
                          First Name <span style="color: red;">*</span>
                        </label>

                        <input
                          id="firstName"
                          v-model="form.firstName"
                          type="text"
                          name="firstName"
                          class="form-control"
                          placeholder="First name"
                          required
                        >
                      </div>
                    </div>

                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-label" for="lastName">
                          Last Name <span style="color: red;">*</span>
                        </label>

                        <input
                          id="lastName"
                          v-model="form.lastName"
                          type="text"
                          name="lastName"
                          class="form-control"
                          placeholder="Last name"
                          required
                        >
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-label" for="email">
                          Email <span style="color: red;">*</span>
                        </label>

                        <input
                          id="email"
                          v-model="form.email"
                          type="text"
                          name="email"
                          class="form-control"
                          placeholder="Email"
                          required
                        >
                      </div>
                    </div>

                    <div class="col-lg-6">
                      <div class="form-group">
                        <label class="form-label" for="password">
                          Password
                          <span class="d-block text-muted">Passwords are automatically generated and sent to the user's email address.</span>
                        </label>

                        <input
                          id="password"
                          value="password"
                          type="password"
                          name="password"
                          class="form-control"
                          readonly
                          disabled
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
