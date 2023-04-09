<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()

onMounted(() => {
  const backdrop = document.querySelector('#sidebar-backdrop') as HTMLElement

  backdrop.addEventListener('click', () => {
    settings.toggleSideBar()
  })
})
</script>

<template>
  <div class="d-flex flex-row align-items-stretch">
    <SideBar />

    <div class="main-content" role="main">
      <div id="sidebar-backdrop" class="sidebar-backdrop" />

      <Header />

      <NuxtPage />
    </div>

    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 99;" />
  </div>
</template>

<style lang="scss" scoped>
.g-sidenav-show {
	.sidenav {
		left: 0;

		.navbar-brand, .navbar-heading {
			display: block;
		}

		.nav-item {
			.collapse {
				height: auto;
				transition: all .15s ease;
			}
		}

		.nav-link-text {
			transition: .3s ease;
			opacity: 1;
		}
	}
}

@media screen and (min-width: 768px) {
	.g-sidenav-show {
		.main-content {
			padding-left: 250px;
		}
	}
}

@media screen and (max-width: 768px) {
	.g-sidenav-show {
		.main-content {
			.sidebar-backdrop {
				display: block;
			}
		}
	}
}

@media screen and (min-width: 768px) {
	.g-sidenav-show {
		&.pinned {
			.main-content {
				padding-left: 80px;
			}
		}
	}
}
</style>
