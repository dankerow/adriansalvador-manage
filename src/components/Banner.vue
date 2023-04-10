<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
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

const colorMode = useColorMode()
const slots = useSlots()
const route = useRoute()
</script>

<template>
  <ColorScheme tag="div">
    <div
      class="banner pt-4 pb-6"
      :class="{ 'bg-dark': colorMode.value === 'dark', 'bg-primary': colorMode.value === 'light' }"
    >
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-12 col-md-6 col-lg-4">
            <nav aria-label="breadcrumb" data-aos="fade-down">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <NuxtLink class="link-body-emphasis" to="/">
                    <Icon :name="icon" />
                    <span class="visually-hidden">Home</span>
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
          </div>

          <div v-if="buttons?.length" class="col-12 col-md-6 col-lg-8 text-end">
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
                  class="btn btn-sm"
                  :class="{ 'btn-primary': colorMode.value === 'dark', 'btn-white': colorMode.value === 'light', 'disabled': button.disabled }"
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
                  class="btn btn-sm"
                  :class="{ 'btn-primary': colorMode.value === 'dark', 'btn-white': colorMode.value === 'light', 'disabled': button.disabled }"
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

        <div v-if="slots.body" :class="body?.class ?? 'row mt-4'">
          <slot name="body" />
        </div>
      </div>
    </div>
  </ColorScheme>
</template>
