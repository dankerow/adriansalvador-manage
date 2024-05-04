<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  buttons?: {
    name: string
    text: string
    icon?: string
    url?: string
    disabled?: boolean
    callback?:() => void
  }[],
  links?: {
    name: string
    path?: string
  }[]
}>(), {
  buttons: () => ([]),
  links: () => ([])
})

const route = useRoute()

const buttons = computed(() => {
  return props.buttons?.map((button) => {
    return {
      ...button,
      callback: () => {
        if (button.callback) {
          button.callback()
        }
      },
    }
  })
})
</script>

<template>
  <div>
    <div class="banner py-4">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-12 col-md-6 col-lg-6">
            <h3 class="fw-bolder text-white mb-3">
              {{ title }}
            </h3>

            <nav
              class="d-inline-block"
              aria-label="breadcrumb"
            >
              <ol class="breadcrumb bg-dark bg-opacity-75 rounded-3 mb-0 px-3 py-1 align-items-center text-capitalize">
                <li class="breadcrumb-item">
                  <NuxtLink
                    class="link-body-emphasis"
                    to="/dashboard"
                    :disabled="route.path === '/dashboard'"
                  >
                    home
                  </NuxtLink>
                </li>

                <template
                  v-for="link in links"
                  :key="link.name"
                >
                  <li
                    v-if="link.path && link.path !== route.path"
                    class="breadcrumb-item"
                  >
                    <NuxtLink
                      class="link-body-emphasis fw-semibold"
                      :class="{
                        'text-truncate': link.name.length > 20
                      }"
                      :to="link.path"
                      :disabled="link.path === route.path"
                    >
                      {{ link.name }}
                    </NuxtLink>
                  </li>

                  <li
                    v-else
                    class="breadcrumb-item active"
                    aria-current="page"
                  >
                    {{ link.name }}
                  </li>
                </template>
              </ol>
            </nav>
          </div>

          <div
            v-if="buttons?.length"
            class="col-12 col-md-6 col-lg-6 text-end"
          >
            <slot
              v-for="(button, index) in buttons"
              :key="index"
              :name="`button-${button.name.replace(/ /g, '-').toLowerCase()}`"
              :button="button"
            >
              <NuxtLink
                v-if="button.url"
                :key="`${button.name}-link-${index}`"
                :to="button.url"
                class="btn btn-sm btn-white"
                :class="{ disabled: button.disabled }"
                :disabled="button.disabled"
              >
                <Icon
                  v-if="button.icon"
                  :name="button.icon"
                />
                <span>
                  {{ button.text }}
                </span>
              </NuxtLink>

              <button
                v-else
                :key="button.name"
                class="btn btn-sm btn-white d-inline-flex align-items-center"
                :class="{ disabled: button.disabled }"
                :disabled="button.disabled"
                @click="button.callback"
              >
                <Icon
                  v-if="button.icon"
                  :name="button.icon"
                />
                <span>
                  {{ button.text }}
                </span>
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
