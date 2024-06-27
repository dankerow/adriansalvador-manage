<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Adrian Salvador - Dashboard` : 'Adrian Salvador - Dashboard'
  }
})

const settings = useSettingsStore()
const colorMode = useColorMode()
const toasts = useToasts()
const { removeToast } = useToast()

onMounted(() => {
  const setTheme = function(theme: string) {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }
  setTheme(colorMode.value)
})
</script>

<template>
  <div class="d-flex flex-row align-items-stretch" :class="{ 'sidebar-show': settings.isSidebarPinned }">
    <Sidebar />

    <div class="main-content" role="main">
      <div class="sidebar-backdrop" @click="settings.toggleSidebar()" />

      <Header />

      <slot />
    </div>

    <ToastContainer placement="bottom-end" visible>
      <Toast v-for="(toast, index) in toasts" :key="index" :title="toast.title" :body="toast.body" :color="toast?.color" visible @close="removeToast(toast)" />
    </ToastContainer>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  --bs-bg-opacity: 1;

  background-color: rgba(var(--bs-light-subtle-rgb), var(--bs-bg-opacity));
  height: 100%;
  overflow-x: hidden;
  padding-bottom: 2rem;
  position: fixed;
  transition: padding-left .3s ease-in-out;
  width: 100%;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--bs-primary);
  }

  &::-webkit-scrollbar-button {
    display: none;
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}

@media (min-width: 768px) {
  .main-content .container,
  .main-content .container-fluid,
  .main-content .container-md,
  .main-content .container-sm,
  .main-content .container-lg,
  .main-content .container-xl {
    padding-right: 40px;
    padding-left: 40px;
  }
}

.main-content .sidebar-backdrop {
  --bs-bg-opacity: 1;

  background-color: rgba(var(--bs-black-rgb), var(--bs-bg-opacity));
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 998;
  opacity: .5;
  display: none;
}

.sidebar-show {
  .sidebar {
    left: 0;

    .navbar-brand, .navbar-heading {
      display: block;
    }

    .nav-item {
      .collapse {
        height: auto;
        transition: all .3s ease-in-out;
      }
    }

    .nav-link-text {
      transition: .3s ease-in-out;
      opacity: 1;
    }
  }
}

@media screen and (min-width: 768px) {
  .sidebar-show {
    .main-content {
      padding-left: 250px;
    }
  }
}

@media screen and (max-width: 768px) {
  .sidebar-show {
    .main-content {
      .sidebar-backdrop {
        display: block;
      }
    }
  }
}

@media screen and (min-width: 768px) {
  .sidebar-show {
    &.pinned {
      .main-content {
        padding-left: 80px;
      }
    }
  }
}

.dark-mode {
  .main-content {
    background-color: transparent;
  }
}
</style>
