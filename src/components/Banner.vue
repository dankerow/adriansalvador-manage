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
  }[]
}>(), {
  buttons: () => ([])
})

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
          <div class="col-12 col-md-6 col-lg-4">
            <h1 class="fw-bolder d-inline-block mb-0">
              {{ title }}
            </h1>
          </div>

          <div v-if="buttons?.length" class="col-12 col-md-6 col-lg-8 text-end">
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
                <Icon v-if="button.icon" :name="button.icon" />
                <span>
                  {{ button.text }}
                </span>
              </NuxtLink>

              <button
                v-else
                :key="button.name"
                class="btn btn-sm btn-white"
                :class="{ disabled: button.disabled }"
                :disabled="button.disabled"
                @click="button.callback"
              >
                <Icon v-if="button.icon" :name="button.icon" />
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
