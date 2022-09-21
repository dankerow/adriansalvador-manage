<template>
	<header>
		<nav :class="`navbar ${$colorMode.value === 'dark' ? 'navbar-dark' : '' } navbar-expand border-light`">
			<div class="container-fluid">
				<div class="collapse navbar-collapse">
					<ul class="navbar-nav">
						<li class="nav-item">
							<div class="sidenav-toggler" data-action="sidenav-pin" data-target="#sidenav-main">
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
										{{ user.firstName[0] + user.lastName[0] }}
									</span>
								</div>
							</a>

							<div :class="`dropdown-menu ${$colorMode.value === 'dark' ? 'dropdown-menu-dark' : '' } dropdown-menu-end`">
								<div class="dropdown-header">
									<h5 class="mb-0">
										Welcome!
									</h5>
								</div>
								<div class="dropdown-divider" />
								<div class="dropdown-item">
									<span>Settings</span>
								</div>
								<div class="dropdown-item" @click="logout">
									<SignOutAlt />
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

<script>
export default {
	components: {
		SignOutAlt: () => import('~/assets/icons/sign-out-alt.svg?inline')
	},
	data({ $store }) {
		return {
			user: $store.state.auth.user
		}
	},
	created() {
		this.$nuxt.$on('toggleSidenavToggler', () => {
			this.toggleSidenavToggler()
		})
	},
	mounted() {
		const sidenavToggle = document.querySelector('.sidenav-toggler')

		sidenavToggle.addEventListener('click', (event) => {
			event.preventDefault()

			const action = sidenavToggle.dataset.action

			switch (action) {
			case 'sidenav-pin':
				this.$nuxt.$emit('pinSidenav')
				break

			case 'sidenav-unpin':
				this.$nuxt.$emit('unpinSidenav')
				break
			}
		})
	},
	methods: {
		toggleSidenavToggler() {
			const sidenavToggle = document.querySelector('.sidenav-toggler')

			if (sidenavToggle.classList.contains('active')) {
				sidenavToggle.classList.remove('active')
				sidenavToggle.dataset.action = 'sidenav-pin'
			} else {
				sidenavToggle.classList.add('active')
				sidenavToggle.dataset.action = 'sidenav-unpin'
			}
		},
		logout() {
			if (this.$store.state.auth.loggedIn) {
				this.$store.dispatch('auth/logout').then(() => {
					this.$router.push('/auth/login')
				})
			}

			this.$router.push('/auth/login')
		}
	}
}
</script>

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
				height: .95rem;
				margin-right: .275rem;
				width: .95rem;
			}
		}
	}
}

.dark-mode {
	header {
		.navbar {
			background-color: rgb(20, 20, 20);
		}
	}
}
</style>
