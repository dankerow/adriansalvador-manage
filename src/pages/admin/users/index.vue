<template>
	<div>
		<div :class="`header ${$colorMode.value === 'dark' ? 'bg-darker' : '' } pt-4 pb-6`">
			<div class="container-fluid">
				<div class="row align-items-center">
					<div class="col-6 col-md-3 col-lg-4">
						<div class="icon icon-shape icon-shape-dark me-2 shadow-sm">
							<UserIcon />
						</div>
						<h3 class="fw-bolder text-uppercase d-inline-block mb-0">
							Users
						</h3>
					</div>

					<div class="col-6 col-md-9 col-lg-8 text-end">
						<NuxtLink to="/users/add" :class="`btn btn-sm ${$colorMode.value === 'dark' ? 'btn-dark' : 'btn-white' }`">
							New user
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>

		<div class="container-fluid mt-n4">
			<div class="row">
				<div class="col">
					<Table :columns="table.columns" url="/api/users" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	components: {
		UserIcon: () => import('~/assets/icons/user.svg?inline')
	},
	data({ $store }) {
		return {
			user: $store.state.auth.user,
			users: [],
			table: {
				columns: [
					{
						label: 'Name',
						prop: 'firstName',
						cellOptions: {
							link: true
						}
					}
				]
			}
		}
	}
}
</script>
