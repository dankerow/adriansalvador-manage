<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'

const colorMode = useColorMode()
const authStore = useAuthStore()
const settings = useSettingsStore()

const dataAction = settings.isSidebarPinned ? 'unpin' : 'pin'

const toggleSidebarToggler = () => {
  settings.toggleSidebar()
}

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
            <li class="nav-item">
              <div
                class="sidebar-toggler"
                :class="{ active: settings.isSidebarPinned }"
                :data-action="dataAction"
                data-target="#sidebar-main"
                @click.prevent="toggleSidebarToggler"
              >
                <i class="sidebar-toggler-line" />
                <i class="sidebar-toggler-line" />
                <i class="sidebar-toggler-line" />
              </div>
            </li>
          </ul>

          <ul class="navbar-nav ms-auto">
            <li class="nav-item ms-auto dropdown">
              <a
                class="nav-link ps-0"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div class="avatar bg-white text-primary rounded shadow-sm">
                  <span class="avatar-text">
                    {{ authStore.user?.firstName[0] + (authStore.user?.lastName[0] || '') }}
                  </span>
                </div>
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
  </header>
</template>

<style lang="scss" scoped>
.navbar {
  --bs-bg-opacity: 1;
  --bs-border-opacity: 1;

  background-color: rgba(var(--bs-primary-rgb), var(--bs-bg-opacity));
  border-color: rgba(var(--bs-light-rgb), var(--bs-border-opacity));
}

.sidebar-toggler {
	cursor: pointer;

	&.active {
		.sidebar-toggler-line {
			&:first-child {
				width: 18px;
				transform: translateX(6px);
			}

			&:last-child {
				width: 14px;
				transform: translateX(10px);
			}
		}
	}

	.sidebar-toggler-line {
		transition: all .3s ease-in-out;
		width: 24px;
		position: relative;
		display: block;
		height: 3px;
		background-color: #fff;

		&:not(:last-child) {
			margin-bottom: 3.5px;
		}
	}
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

.dark-mode {
  .navbar {
    --bs-bg-opacity: 1;
    --bs-border-opacity: 1;

    background-color: rgba(var(--bs-darker-rgb), var(--bs-bg-opacity));
    border-color: rgba(var(--bs-dark-rgb), var(--bs-border-opacity));
  }
}
</style>
