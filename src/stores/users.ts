import { defineStore } from 'pinia'
import type { Ref } from 'vue'

interface User {
	id: string
	username: string
	email: string
	createdAt: string
	updatedAt: string
}

interface UserState {
	users: (User)[]
	count: number
	pages: number
}

export const useUsersStore = defineStore('users', () => {
	const users: Ref<UserState['users']> = ref([])
	const count: Ref<UserState['count']> = ref(0)
	const pages: Ref<UserState['pages']> = ref(0)
	const loading: Ref<boolean> = ref(false)

	const getUsers = async () => {
		loading.value = true
		const { data: usersD, count: countD, pages: pagesD } : { data: UserState['users'], count: UserState['count'], pages: UserState['pages'] } = await useFaetch('/users')

		users.value = usersD
		count.value = countD
		pages.value = pagesD
		loading.value = false
	}

	const getUser = async (id: string) => {
		loading.value = true
		const data: User = await useFaetch(`/users/${id}`)
		loading.value = false
		return data
	}

	const addUser = async (username: string, email: string, password: string) => {
		const data: User = await useFaetch('/users', { method: 'post', body: { username, email, password } })
		users.value.push(data)

		return data
	}

	const updateUser = async (id: string, username: string, email: string, password: string) => {
		const data: User = await useFaetch(`/users/${id}`, { method: 'put', body: { username, email, password } })
		const index = users.value.findIndex((user: any) => user.id === id)
		users.value[index] = data

		return data
	}

	const deleteUser = async (id: string) => {
		await useFaetch(`/users/${id}`, { method: 'delete' })
		const index = users.value.findIndex((user: any) => user.id === id)
		users.value.splice(index, 1)
	}

	return {
		users,
		count,
		pages,
		loading,
		getUsers,
		getUser,
		addUser,
		updateUser,
		deleteUser
	}
})
