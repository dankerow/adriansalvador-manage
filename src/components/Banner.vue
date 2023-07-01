<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title?: string
  links: {
    name: string
    path?: string
  }[]
  buttons?: {
    name: string
    text: string
    icon?: string
    url?: string
    disabled?: boolean
    callback?:() => void
  }[]
  body?: {
    class?: string
  }
}>(), {
  icon: 'ph:house-simple-duotone',
  buttons: () => ([]),
  body: () => ({})
})

const slots = useSlots()
const route = useRoute()
</script>

<template>
  <div>
    <nav class="bg-primary bg-opacity-25 border-primary-subtle border-opacity-10 border-bottom" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0 px-3 py-2">
        <li class="breadcrumb-item">
          <NuxtLink class="link-body-emphasis" to="/">
            <Icon name="ph:house-simple-duotone" size="1.15em" :class="{ 'me-2': links?.length < 1 }" />
            <span :class="{ 'visually-hidden': links?.length > 0 }">Home</span>
          </NuxtLink>
        </li>

        <template v-for="link in links" :key="link.name">
          <li v-if="link.path && link.path !== route.path" class="breadcrumb-item">
            <NuxtLink class="link-body-emphasis fw-semibold text-decoration-none" :to="link.path">
              {{ link.name }}
            </NuxtLink>
          </li>

          <li v-else class="breadcrumb-item active" aria-current="page">
            {{ link.name }}
          </li>
        </template>
      </ol>
    </nav>

    <div class="banner pt-4 pb-6">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="icon icon-shape icon-shape-white me-2 shadow-sm">
              <Icon v-if="icon" :name="icon" class="text-primary" />
            </div>

            <h3 class="fw-bolder text-white d-inline-block mb-0">
              {{ title }}
            </h3>
          </div>

          <div v-if="buttons?.length" class="col-12 col-md-6 col-lg-12 text-end">
            <template v-for="button in buttons">
              <slot
                v-if="slots[`button-${button.name.replace(/ /g, '-')}`]"
                :name="`button-${button.name.replace(/ /g, '-')}`"
                v-bind="button"
              />
              <slot
                v-else-if="slots[`button-${button.name.replace(/ /g, '-').toLowerCase()}`]"
                :name="`button-${button.name.replace(/ /g, '-').toLowerCase()}`"
                v-bind="button"
              />
              <slot
                v-else-if="slots.item"
                name="button"
                v-bind="button"
              />
              <template v-else>
                <NuxtLink
                  v-if="button.url"
                  :key="button.name"
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
              </template>
            </template>
          </div>
        </div>

        <div v-if="slots.body" :class="body?.class ?? 'row mt-2'">
          <slot name="body" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.banner {
  --bs-bg-opacity: 0.85;

  background-color: rgba(var(--bs-primary-rgb), var(--bs-bg-opacity));
}

.dark-mode {
  .banner {
    --bs-bg-opacity: 1;

    background-color: rgba(var(--bs-dark-rgb), var(--bs-bg-opacity));
  }
}
</style>
