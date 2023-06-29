import type { Ref } from 'vue'
import type { User } from '~/types/user'

export const useUsersStore = defineStore('users', () => {
  const users: Ref<User[]> = ref([])
  const count: Ref<number> = ref(0)
  const pages: Ref<number> = ref(0)
  const loading: Ref<boolean> = ref(false)

  const getUsers = async () => {
    loading.value = true
    const { data: usersD, count: countD, pages: pagesD } : { data: User[], count: number, pages: number } = await useFaetch('/users')

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

  const addUser = async ({ firstName, lastName, email }: { firstName: string, lastName: string, email: string }) => {
    try {
      const data: User = await useFaetch('/users', { method: 'post', body: { firstName, lastName, email } })
      users.value.push(data)

      return { error: null }
    } catch (e: any) {
      return { error: e.data ? e.data.error : e }
    }
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

  const deleteUsers = async (ids: string[]) => {
    try {
      await useFaetch('/users', { method: 'delete', body: { ids } })
      users.value = users.value.filter((user: any) => !ids.includes(user.id))

      return { error: null }
    } catch (e: any) {
      return { error: e.data ? e.data.error : e }
    }
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
    deleteUser,
    deleteUsers
  }
})
