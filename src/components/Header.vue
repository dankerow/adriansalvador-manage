<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'

const colorMode = useColorMode()
const authStore = useAuthStore()
const settings = useSettingsStore()

const dataAction = settings.isSideBarPinned ? 'unpin' : 'pin'

const toggleSidenavToggler = () => {
  settings.toggleSideBar()
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
    <nav
      class="navbar navbar-expand"
      :class="{ 'navbar-dark bg-darker border-dark': colorMode.value === 'dark', 'bg-primary border-light': colorMode.value === 'light' }"
    >
      <div class="container-fluid">
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav">
            <li class="nav-item">
              <div
                class="sidenav-toggler"
                :class="{ active: settings.isSideBarPinned }"
                :data-action="dataAction"
                data-target="#sidenav-main"
                @click.prevent="toggleSidenavToggler"
              >
                <i class="sidenav-toggler-line" />
                <i class="sidenav-toggler-line" />
                <i class="sidenav-toggler-line" />
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
                    {{ authStore.user.firstName[0] + authStore.user.lastName[0] }}
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
header {
	.navbar {
		background-color: rgb(245, 245, 245);
	}
}

.sidenav-toggler {
	cursor: pointer;

	&.active {
		.sidenav-toggler-line {
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

	.sidenav-toggler-line {
		transition: all .15s ease;
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
</style>
