<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()

const colorMode = useColorMode()

useHead({
  htmlAttrs: {
    lang: 'en',
    dir: 'auto'
  },
  title: null,
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Adrian Salvador - Dashboard` : 'Adrian Salvador - Dashboard'
  },
  meta: [
    { name: 'description', content: '' },
    { name: 'robots', content: 'noydir,noodp,noarchive,nocache,notranslate,nofollow,noimageindex,noindex' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://cdn.salvadoradrian.com' },
    { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' }
  ],
  script: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/js/bootstrap.bundle.min.js',
      type: 'text/javascript',
      defer: true
    }
  ]
})

const toasts = useToasts()
const { removeToast } = useToast()

onMounted(() => {
  const setTheme = function(theme: string) {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }
  setTheme(colorMode.value)

  const backdrop = document.querySelector('#sidebar-backdrop') as HTMLElement

  backdrop.addEventListener('click', () => {
    settings.toggleSidebar()
  })
})
</script>

<template>
  <div class="d-flex flex-row align-items-stretch">
    <SideBar />

    <div class="main-content" role="main">
      <div id="sidebar-backdrop" class="sidebar-backdrop" />

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
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #abb7ff;
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

.g-sidebar-show {
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
  .g-sidebar-show {
    .main-content {
      padding-left: 250px;
    }
  }
}

@media screen and (max-width: 768px) {
  .g-sidebar-show {
    .main-content {
      .sidebar-backdrop {
        display: block;
      }
    }
  }
}

@media screen and (min-width: 768px) {
  .g-sidebar-show {
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

    &::-webkit-scrollbar-thumb {
      --bs-bg-opacity: 1;

      background-color: rgba(var(--bs-dark-rgb), var(--bs-bg-opacity));
    }
  }
}
</style>
