<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const colorMode = useColorMode()
const settings = useSettingsStore()
const { user } = useUser()

const navigation = ref({
	categories: [
		{
			name: 'general',
			nav: [
				{
					name: 'dashboard',
					path: '/',
					icon: 'ic:twotone-space-dashboard'
				},
				{
					name: 'albums',
					path: '/albums',
					icon: 'ic:twotone-folder-copy',
					dropdown: [
						{
							name: 'overview',
							path: '/albums'
						}
					]
				}
			]
		},
		{
			name: 'Analytics',
			nav: [
				{
					name: 'overview',
					path: '/analytics',
					icon: 'ic:twotone-pie-chart'
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
					icon: 'ic:twotone-settings',
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
					icon: 'ic:outline-supervisor-account',
					dropdown: [
						{
							name: 'Overview',
							path: '/admin/users'
						}
					]
				}
			]
		}
	]
})

const pinSidenav = () => {
	const body = document.querySelector('body')
	settings.updateSideBar(true)
	body?.classList.add('g-sidenav-show')
}

const unpinSidenav = () => {
	const body = document.querySelector('body')
	settings.updateSideBar(false)
	body?.classList.remove('g-sidenav-show')
}

const isNavItemActive = (path: string) => {
	return route.path === path ? true : path !== '/' && route.path.startsWith(path)
}

if (process.client) {
	watchEffect(() => {
		if (settings.sideBar) {
			pinSidenav()
		} else {
			unpinSidenav()
		}
	})
}

onMounted(() => {
	const body = document.querySelector('body')

	const sidenavState = settings.isSideBarPinned

	if (window.innerWidth > 1200) {
		if (sidenavState) pinSidenav()
		else unpinSidenav()
	}

	if (window.innerWidth < 1200) {
		body?.classList.remove('g-sidenav-show')
		unpinSidenav()

		window.addEventListener('resize', () => {
			if (body?.classList.contains('g-sidenav-show')) {
				unpinSidenav()
			}
		})
	}
})

onUnmounted(() => {
	window.removeEventListener('resize', () => {})
})
</script>

<template>
	<aside
		class="sidenav shadow"
		:class="{ 'bg-darker': colorMode.value === 'dark' }"
	>
		<div class="sidenav-header border-bottom">
			<div class="navbar-brand">
				<h2 class="navbar-brand-text">
					Adrian Salvador
				</h2>
			</div>
		</div>

		<div
			class="sidenav-item d-flex flex-nowrap border-bottom py-4 mb-3"
			:class="{ 'bg-dark': colorMode.value === 'dark', 'bg-light': colorMode.value === 'light' }"
		>
			<div class="icon-badge icon-shape icon-shape-darker icon-lg me-3">
				<Icon name="ic:twotone-account-box" />
			</div>
			<div>
				<span style="display: block;white-space: nowrap;text-overflow: ellipsis;">
					{{ user.firstName }} <strong> {{ user.lastName }}</strong>
				</span>
				<span class="rounded text-bg-primary px-1 d-inline-block text-nowrap" style="white-space: nowrap;text-overflow: ellipsis;font-size: 12px">
					<template v-if="user.role === 'admin'">
						Administrator
					</template>
					<template v-else>
						User
					</template>
				</span>
			</div>
		</div>

		<div class="sidemenu mb-auto">
			<template v-for="(category, index) in navigation.categories" :key="`${category.name}-${index}`">
				<div class="sidenav-item">
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
									<Icon class="nav-link-icon" :name="navItem.icon" />
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
									<Icon class="nav-link-icon" :name="navItem.icon" />
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

		<div class="sidebottom d-flex w-100 flex-nowrap px-3 py-1">
			<ThemeSelector />
		</div>
	</aside>
</template>

<style lang="scss" scoped>
.sidenav {
	display: flex;
	flex-direction: column;
	height: 100%;
	left: -250px;
	overflow-x: auto;
	position: fixed;
	top: 0;
	transition: left .35s ease-in-out, width .35s ease-in-out;
	width: 250px;
	z-index: 999;

	&::-webkit-scrollbar {
		width: 0.25rem;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #abb7ff;
		border-radius: 0.25rem;
	}

	&::-webkit-scrollbar-button {
		display: none
	}

	&::-webkit-scrollbar-corner {
		background: transparent;
	}

	.sidenav-header {
		height: 68px;
		padding: 1.5rem 0;
		text-align: center;
		width: 100%;
	}

	.sidenav-item {
		padding: 1rem 1rem 0;
	}

	.navbar-brand {
		.navbar-brand-text {
			color: #fff;
			display: inline-block;
			font-weight: bold;
			margin-bottom: 0;
			text-shadow: 0 2px rgba(10, 10, 10, 0.55);
			text-transform: uppercase;
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
	.sidenav {
		&:hover {
			max-width: 280px;
		}

		.sidenav-toggler {
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
	border-radius: 0.2rem;
	display: flex;
	flex-wrap: nowrap;
	font-weight: 500;
	padding: .5rem .55rem;
	position: relative;
	width: 100%;

	&:hover {
		background: rgba(94, 114, 228, 0.1);
	}

	&.active, &[aria-expanded="true"] {
		background-color: #5e72e4;
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
		transition: transform .35s ease-in-out;
		width: 1.5em;
	}

	&[aria-expanded="true"] {
		border-radius: 0.2rem 0.2rem 0 0;

		&:after {
			$toggler-color: rgb(255, 255, 255);

			content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='#{$toggler-color}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
			transform: rotate(90deg);
		}
	}

	.nav-link-icon {
		flex-shrink: 0;
		margin-right: .5rem;
		height: 1.25rem;
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
	.sidenav {
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
			background: rgba(27, 27, 27, 0.8);
		}
	}

	.nav-link-nav {
		background-color: rgb(23, 23, 23);
	}
}
</style>
