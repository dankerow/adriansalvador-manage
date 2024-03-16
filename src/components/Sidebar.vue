<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const settings = useSettingsStore()

const navigation = {
  categories: [
    {
      name: 'general',
      nav: [
        {
          name: 'dashboard',
          path: '/dashboard',
          icon: 'ic:twotone-space-dashboard'
        },
        {
          name: 'media',
          path: '/media',
          icon: 'ph:images-duotone'
        }
      ]
    },
    {
      name: 'Analytics',
      nav: [
        {
          name: 'overview',
          path: '/analytics',
          icon: 'ph:chart-line-up-duotone'
        }
      ]
    },
    {
      name: 'administration',
      adminOnly: true,
      nav: [
        {
          name: 'Settings',
          path: '/admin/settings',
          icon: 'ph:gear-fine-duotone',
          dropdown: [
            {
              name: 'Overview',
              disabled: true,
              path: '/admin/settings'
            }
          ]
        },
        {
          name: 'Users',
          path: '/admin/users',
          icon: 'ph:users-three-duotone'
        }
      ]
    }
  ]
}

const dataAction = settings.isSidebarPinned ? 'unpin' : 'pin'

const pinSidebar = () => {
  settings.updateSidebar(true)
}

const unpinSidebar = () => {
  settings.updateSidebar(false)
}

const isNavItemActive = (path: string) => {
  return route.path.startsWith(path) && path !== '/'
}

if (process.client) {
  watchEffect(() => {
    if (settings.sidebar) {
      pinSidebar()
    } else {
      unpinSidebar()
    }
  })
}

onMounted(() => {
  if (window.innerWidth > 1200) {
    if (settings.isSidebarPinned) pinSidebar()
    else unpinSidebar()
  }

  if (window.innerWidth < 1200) {
    unpinSidebar()

    window.addEventListener('resize', () => {
      if (settings.isSidebarPinned) {
        unpinSidebar()
      }
    })
  }
})
</script>

<template>
  <div class="sidebar shadow-sm">
    <div class="sidebar-header">
      <div class="d-flex flex-row align-items-center justify-content-between">
        <div class="navbar-brand">
          <h2 class="navbar-brand-text d-inline-block fs-5 fw-bold m-0">
            Folio
          </h2>
        </div>

        <Icon
          :data-action="dataAction"
          data-target="#sidebar-main"
          name="tabler:layout-sidebar-right-expand"
          @click.prevent="settings.toggleSidebar()"
        />
      </div>
    </div>

    <div class="sidebar-nav mb-auto">
      <template v-for="(category, index) in navigation.categories" :key="`${category.name}-${index}`">
        <div class="sidebar-item">
          <span class="navbar-heading">
            {{ category.name }}
          </span>

          <ul class="navbar-nav nav list-unstyled ps-0">
            <li v-for="(navItem, indexNav) in category.nav" :key="`${navItem.name}-${indexNav}`" class="nav-item">
              <template v-if="navItem.dropdown">
                <a
                  :class="`nav-link align-items-center ${isNavItemActive(navItem.path) ? 'collapsed' : ''}`"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="`#${navItem.name.replace(' ', '-')}-collapse`"
                  :aria-expanded="isNavItemActive(navItem.path)"
                  aria-dropdown="true"
                >
                  <Icon v-if="navItem.icon" class="nav-link-icon" :name="navItem.icon" />
                  <span>
                    {{ navItem.name }}
                  </span>
                </a>

                <div :id="`${navItem.name.replace(' ', '-')}-collapse`" :class="`collapse ${isNavItemActive(navItem.path) ? 'show' : ''}`">
                  <ul class="nav-link-nav list-unstyled fw-normal pb-1 small">
                    <li v-for="(navDropdownItem, indexDropdown) in navItem.dropdown" :key="`${navItem.name}-${navDropdownItem.name}-${indexDropdown}`">
                      <a v-if="navDropdownItem.disabled" href="#" class="nav-link disabled">
                        {{ navDropdownItem.name }}
                      </a>

                      <NuxtLink v-else :to="navDropdownItem.path" class="nav-link">
                        {{ navDropdownItem.name }}
                      </NuxtLink>
                    </li>
                  </ul>
                </div>
              </template>

              <template v-else>
                <a v-if="navItem.disabled" href="#" class="nav-link disabled align-items-center">
                  <Icon v-if="navItem.icon" class="nav-link-icon" :name="navItem.icon" />
                  <span>
                    {{ navItem.name }}
                  </span>
                </a>
                <NuxtLink
                  v-else
                  :class="`nav-link align-items-center ${isNavItemActive(navItem.path) ? 'active' : ''}`"
                  :to="navItem.path"
                >
                  <Icon class="nav-link-icon" :name="navItem.icon" />
                  <span>
                    {{ navItem.name }}
                  </span>
                </NuxtLink>
              </template>
            </li>
          </ul>
        </div>
      </template>
    </div>

    <hr>

    <div class="sidebar-footer d-flex w-100 flex-nowrap px-3 py-1">
      <ThemeSelector />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  --bs-bg-opacity: 1;

  background-color: rgba(var(--bs-white-rgb), var(--bs-bg-opacity));
	display: flex;
	flex-direction: column;
	height: 100%;
	left: -250px;
	overflow-x: auto;
	position: fixed;
	top: 0;
	transition: left .3s ease-in-out, width .3s ease-in-out;
	width: 250px;
	z-index: 999;

	&::-webkit-scrollbar {
		width: 0.25rem;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #abb7ff;
		border-radius: var(--bs-border-radius);
	}

	&::-webkit-scrollbar-button {
		display: none
	}

	&::-webkit-scrollbar-corner {
		background: transparent;
	}

	.sidebar-header {
		padding: 1.08rem 0.75rem;
		width: 100%;
	}

	.sidebar-item {
		padding: 0 1rem 0 1rem;

    &:not(:first-child) {
      padding-top: 1rem;
    }
	}

	.navbar-heading {
		font-size: .70rem;
		font-weight: lighter;
		letter-spacing: .04em;
		padding: .25rem .45rem;
		text-transform: uppercase;
	}
}

@media (min-width: 1200px) {
	.sidebar {
		&:hover {
			max-width: 280px;
		}

		.sidebar-toggler {
			padding: 1.5rem;
		}
	}
}

.nav-item {
	text-transform: capitalize;

	&:not(:last-child) {
		margin-bottom: .35rem;
	}
}

.nav-link {
	align-items: center;
	border-radius: var(--bs-border-radius);
	display: flex;
	flex-wrap: nowrap;
	font-weight: 500;
	padding: .5rem .55rem;
	position: relative;
	width: 100%;

	&:hover {
   background: rgba(94, 114, 228, 0.1);

   .nav-link-icon {
     --bs-text-opacity: 1;

     color: rgba(var(--bs-primary-rgb), var(--bs-text-opacity));
   }
	}

	&.active, &[aria-expanded="true"] {
   background-color: rgba(var(--bs-primary-rgb));
   color: white;

   .nav-link-icon {
     color: white;
   }
	}

	&[aria-dropdown="true"]:after {
		$toggler-color: rgba(0, 0, 0, .65);

		content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='#{$toggler-color}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
		display: inline-block;
		line-height: 0;
		position: absolute;
		right: 8px;
		transform-origin: .5em 50%;
		transition: transform .3s ease-in-out;
		width: 1.5em;
	}

	&[aria-expanded="true"] {
		border-radius: var(--bs-border-radius) var(--bs-border-radius) 0 0;

		&:after {
			$toggler-color: rgb(255, 255, 255);

			content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='#{$toggler-color}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
			transform: rotate(90deg);
		}
	}

	.nav-link-icon {
		flex-shrink: 0;
		height: 1.25rem;
    margin-right: .5rem;
		transition: color .3s ease-in-out;
		vertical-align: middle;
		width: 1.25rem;
	}
}

.nav-link-nav {
	background-color: rgba(94, 114, 228, 0.1);
	border-bottom-left-radius: 0.25rem;
	border-bottom-right-radius: 0.25rem;

	a {
		display: flex;
		padding: .5rem .5rem .5rem 2.3rem;
	}
}


.dark-mode {
	.sidebar {
    background: linear-gradient(var(--bs-darker), darken(rgb(13, 13, 13), 0.8%));

		&::-webkit-scrollbar-thumb {
			background-color: rgb(37, 37, 37);
		}
	}

	.nav-link {
		&.active, &[aria-expanded="true"] {
			color: white;
			background-color: rgba(27, 27, 27);
		}

		&[aria-dropdown="true"]:after {
			$toggler-color: rgba(170, 170, 170, .65);

			content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='#{$toggler-color}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
		}

		&[aria-expanded="true"] {
			&:after {
				$toggler-color: rgb(170, 170, 170);

				content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='#{$toggler-color}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
			}
		}

		&:hover {
			background: rgba(27, 27, 27);
		}
	}

	.nav-link-nav {
		background-color: rgb(23, 23, 23);
	}
}
</style>
