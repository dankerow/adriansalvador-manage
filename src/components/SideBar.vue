<template>
	<aside class="sidenav">
		<div class="sidenav-header border-bottom">
			<div class="navbar-brand">
				<h2 class="navbar-brand-text">
					Adrian Salvador
				</h2>
			</div>
		</div>

		<div class="active-user sidenav-item border-bottom d-flex flex-nowrap py-4 px-3 mb-3">
			<div class="avatar avatar-lg bg-primary text-white rounded me-3 shadow-sm">
				<UserIcon />
			</div>
			<div>
				<span style="display: block;white-space: nowrap;text-overflow: ellipsis;">
					{{ user.firstName }} <strong> {{ user.lastName }}</strong>
				</span>
				<span style="display: block;white-space: nowrap;text-overflow: ellipsis;font-size: 12px">
					<template v-if="user.permissions.administrator">
						Administrator
					</template>
					<template v-else>
						User
					</template>
				</span>
			</div>
		</div>

		<div class="px-3">
			<template v-for="(category, index) in navigation.categories">
				<div :key="`${category.name}-${index}`" class="sidenav-item">
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
									<span class="nav-link-icon">
										<HomeIcon />
									</span>
									<span>
										{{ navItem.name }}
									</span>
								</a>

								<div :id="`${navItem.name.replace(' ', '-')}-collapse`" :class="`collapse ${isNavItemActive(navItem.path) ? 'show' : ''}`">
									<ul class="nav-link-nav list-unstyled fw-normal pb-1 small">
										<li v-for="(navDropdownItem, indexDropdown) in navItem.dropdown" :key="`${navItem.name}-${navDropdownItem.name}-${indexDropdown}`">
											<NuxtLink :to="navDropdownItem.path" class="rounded">
												{{ navDropdownItem.name }}
											</NuxtLink>
										</li>
									</ul>
								</div>
							</template>
							<template v-else>
								<NuxtLink
									:class="`nav-link align-items-center ${isNavItemActive(navItem.path) ? 'active' : ''}`"
									aria-dropdown="false"
									:to="navItem.path"
								>
									<span class="nav-link-icon">
										<HomeIcon />
									</span>
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
	</aside>
</template>

<script>
export default {
	components: {
		HomeIcon: () => import('~/assets/icons/home.svg?inline'),
		UserIcon: () => import('~/assets/icons/user.svg?inline')
	},
	data({ $store }) {
		return {
			user: $store.state.auth.user,
			navigation: {
				categories: [
					{
						name: 'general',
						nav: [
							{
								name: 'dashboard',
								path: '/'
							},
							{
								name: 'albums',
								path: '/albums',
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
						name: 'administration',
						adminOnly: true,
						nav: [
							{
								name: 'Settings',
								path: '/admin/settings',
								dropdown: [
									{
										name: 'Overview',
										path: '/admin/settings'
									}
								]
							},
							{
								name: 'Users',
								path: '/admin/users',
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
			}
		}
	},
	created() {
		this.$nuxt.$on('pinSidenav', () => {
			this.pinSidenav()
		})

		this.$nuxt.$on('unpinSidenav', () => {
			this.unpinSidenav()
		})
	},
	beforeDestroy() {
		this.$nuxt.$off('pinSidenav')
		this.$nuxt.$off('unpinSidenav')
	},
	mounted() {
		const body = document.querySelector('body')

		const sidenavState = localStorage.getItem('sidenav-state') ? localStorage.getItem('sidenav-state') : 'pinned'

		if (window.innerWidth > 1200) {
			if (sidenavState === 'pinned') this.pinSidenav()
			else this.unpinSidenav()
		}

		if (window.innerWidth < 1200) {
			body.classList.remove('g-sidenav-show')

			window.addEventListener('resize', () => {
				if (body.classList.contains('g-sidenav-show')) {
					this.unpinSidenav()
				}
			})
		}
	},
	methods: {
		pinSidenav() {
			const body = document.querySelector('body')
			this.$nuxt.$emit('toggleSidenavToggler')
			body.classList.add('g-sidenav-show')

			localStorage.setItem('sidenav-state', 'pinned')
		},
		unpinSidenav() {
			const body = document.querySelector('body')
			this.$nuxt.$emit('toggleSidenavToggler')
			body.classList.remove('g-sidenav-show')

			localStorage.setItem('sidenav-state', 'unpinned')
		},
		isNavItemActive(path) {
			const route = this.$route
			return route.path === path ? true : path !== '/' && route.path.startsWith(path)
		}
	}
}
</script>

<style lang="scss" scoped>
.sidenav {
	background-color: rgb(245, 245, 245);
	box-shadow: 0 0 2rem 0 rgba(136, 152, 170, .15);
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
		background-color: #5b6edb;
		height: 68px;
		padding: 1.5rem 0;
		text-align: center;
		width: 100%;
	}

	.sidenav-item {
		padding: 1rem 0;

		&.bg-light-blue {
			background: #f1f3ff;
		}
	}

	.navbar-brand {
		.navbar-brand-text {
			color: #fff;
			display: inline-block;
			font-weight: bold;
			margin-bottom: 0;
			text-shadow: 0 2px rgba(46, 56, 111, 0.55);
			text-transform: uppercase;
		}
	}

	.navbar-heading {
		font-size: .75rem;
		letter-spacing: .04em;
		padding: .275rem .675rem;
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
		margin-bottom: .475rem;
	}
}

.nav-link {
	align-items: center;
	border-radius: 0.2rem;
	display: flex;
	flex-wrap: nowrap;
	font-weight: 600;
	padding: .5rem .55rem;
	position: relative;
	width: 100%;

	&:hover {
		background: rgba(94, 114, 228, 0.1);
	}

	&.active {
		background-color: #5e72e4;
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

		.nav-link-icon {
			i, svg {
				color: white;
			}
		}
	}

	.nav-link-icon {
		flex-shrink: 0;
		margin-right: .675rem;

		svg {
			color: #5e72e4;
			height: 1rem;
			vertical-align: text-top;
			width: 1rem;
		}
	}
}

.nav-link-nav {
	background-color: rgba(94, 114, 228, 0.1);
	border-bottom-left-radius: 0.25rem;
	border-bottom-right-radius: 0.25rem;

	a {
		display: flex;
		padding: .5rem .5rem .5rem 2rem;
	}
}

.dark-mode {
	.sidenav {
		background-color: rgb(20, 20, 20);
		box-shadow: 1rem 0 0 0 rgba(20, 20, 20, .15);

		.sidenav-header {
			background-color: rgb(20, 20, 20);
		}

		.active-user {
			background-color: #1b1b1b;
		}
	}

	.nav-link {
		&.active, &[aria-expanded="true"] {
			background-color: #1b1b1b;
		}

		&[aria-dropdown="true"]:after {
			$toggler-color: rgba(170, 170, 170, .65);

			content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='#{$toggler-color}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
			display: inline-block;
			line-height: 0;
			position: absolute;
			right: 8px;
			transform-origin: .5em 50%;
			transition: transform .35s ease-in-out;
			width: 1.5em;
		}

		&:hover {
			background: rgba(27, 27, 27, 0.5);
		}

		.nav-link-icon {
			svg {
				color: inherit;
			}
		}
	}

	.nav-link-nav {
		background-color: rgba(27, 27, 27, 0.5);
	}
}
</style>
