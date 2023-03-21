<script setup lang="ts">
import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()

const table = ref({
	columns: [
		{
			label: 'Name',
			prop: 'firstName',
			cellOptions: {
				link: true
			}
		},
		{
			label: 'Role',
			prop: 'role'
		},
		{
			label: 'Created At',
			prop: 'createdAt',
			cellOptions: {
				date: true
			}
		}
	]
})

if (usersStore.users.length === 0) {
	await usersStore.getUsers()
}

const users = ref({
	loading: usersStore.loading,
	data: usersStore.users,
	count: usersStore.count,
	pages: usersStore.pages
})
</script>

<template>
	<div>
		<Banner title="users" icon="ic:outline-supervisor-account" :buttons="[{ name: 'newUser', text: 'New user', url: '/admin/users/add' }]" />

		<div class="container-fluid mt-n4">
			<div class="row">
				<div class="col">
					<DataTable :loading="users.loading" :data="users.data" :columns="table.columns" :pagination="{ count: users.count, pages: users.pages }" />
				</div>
			</div>
		</div>
	</div>
</template>
