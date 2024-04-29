import type { User } from '@/types/user'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const count = ref<number>(0)
  const pages = ref<number>(0)

  const getUsers = async () => {
    const { data: usersD, count: countD, pages: pagesD } = await useFaetch<{ data: User[], count: number, pages: number  }>('/users')

    users.value = usersD
    count.value = countD
    pages.value = pagesD
  }

  const getUser = async (id: string) => {
    const data = await useFaetch<User>(`/users/${id}`)

    return data
  }

  const addUser = async ({ firstName, lastName, email }: { firstName: string, lastName: string, email: string }) => {
    try {
      const data = await useFaetch<User>('/users', {
        method: 'post',
        body: { firstName, lastName, email }
      })
      users.value.push(data)

      return { error: null }
    } catch (e) {
      return { error: e.data ? e.data.error : e }
    }
  }

  const updateUser = async (id: string, username: string, email: string, password: string) => {
    const data = await useFaetch<User>(`/users/${id}`, {
      method: 'put',
      body: { username, email, password }
    })
    const index = users.value.findIndex((user) => user._id === id)
    users.value[index] = data

    return data
  }

  const deleteUser = async (id: string) => {
    await useFaetch(`/users/${id}`, {
      method: 'delete'
    })

    const index = users.value.findIndex((user) => user._id === id)

    users.value.splice(index, 1)
  }

  const deleteUsers = async (ids: string[]) => {
    try {
      await useFaetch('/users', {
        method: 'delete',
        body: { ids }
      })

      users.value = users.value.filter((user) => !ids.includes(user._id))

      return { error: null }
    } catch (e) {
      return { error: e.data ? e.data.error : e }
    }
  }

  return {
    users,
    count,
    pages,
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    deleteUsers
  }
})
