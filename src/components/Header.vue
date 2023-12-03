<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'

const colorMode = useColorMode()
const authStore = useAuthStore()
const settings = useSettingsStore()

const dataAction = settings.isSidebarPinned ? 'unpin' : 'pin'

const logout = () => {
  if (authStore.isLoggedIn) {
    authStore.logout()
  }

  return navigateTo('/auth/login')
}
</script>

<template>
  <header>
    <nav class="navbar navbar-expand">
      <div class="container-fluid">
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav">
            <li v-if="!settings.isSidebarPinned" class="nav-item">
              <div
                class="sidebar-toggler"
                :data-action="dataAction"
                data-target="#sidebar-main"
                @click.prevent="settings.toggleSidebar()"
              >
                <Icon name="tabler:layout-sidebar-left-expand" />
              </div>
            </li>
          </ul>

          <ul class="navbar-nav ms-auto">
            <li class="nav-item ms-auto dropdown">
              <a
                class="nav-link dropdown-toggle ps-0"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ authStore.user?.firstName }}
              </a>

              <div
                class="dropdown-menu dropdown-menu-end"
                :class="{ 'dropdown-menu-dark': colorMode.value === 'dark' }"
              >
                <div class="dropdown-header">
                  <h5 class="mb-0">
                    Welcome!
                  </h5>
                </div>

                <div class="dropdown-divider" />

                <NuxtLink class="dropdown-item" to="/settings">
                  <Icon name="ic:twotone-settings" />
                  <span>Settings</span>
                </NuxtLink>

                <div class="dropdown-item" @click="logout">
                  <Icon name="ic:twotone-log-out" />
                  <span>Logout</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <hr class="mx-3">
  </header>
</template>

<style lang="scss" scoped>
.sidebar-toggler {
	cursor: pointer;
}

.dropdown {
	.dropdown-menu {
		.dropdown-item {
			cursor: pointer;
			transition: background-color 0.3s ease-in-out;

			svg {
				height: 1rem;
				margin-right: .275rem;
				width: 1rem;
			}
		}
	}
}
</style>
