<script setup lang="ts">
import type { Row } from '@/types/datatable'

import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()

const table = {
  columns: [
    {
      label: 'Name',
      prop: 'firstName'
    },
    {
      label: 'Role',
      prop: 'role'
    },
    {
      label: 'Created On',
      prop: 'createdAt'
    }
  ]
}

const dataTable = ref()

const getSelectedRows = computed(() => {
  return dataTable.value?.selectedRows
})

const loadUsers = async (options?: { limit: number, page: number }) => {
  await usersStore.getUsers(options)
}

const deleteSelectedUsers = async () => {
  const selectedRows = getSelectedRows.value

  if (selectedRows.length === 0) {
    return
  }

  const ids = selectedRows.map((row: Row) => row.id)

  await usersStore.deleteUsers(ids)

  dataTable.value?.deselectAllRows()
}

if (usersStore.users.length === 0) {
  await loadUsers()
}
</script>

<template>
  <div>
    <Banner
      title="Users"
      :buttons="[
        { name: 'newUser', text: 'New user', url: '/admin/users/add', icon: 'ic:baseline-person-add' },
        { name: 'delete-selected-users', text: 'Delete Selected Users', callback: deleteSelectedUsers, disabled: !getSelectedRows?.length, icon: 'ic:twotone-delete' }
      ]"
    />

    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <DataTable
            ref="dataTable"
            selection
            multiple-selection
            :data="usersStore.users"
            :columns="table.columns"
            :pagination="{
              count: usersStore.count,
              pages: usersStore.pages
            }"
            @load-data="loadUsers"
          >
            <template #item-createdAt="{ item, column }">
              <NuxtTime :datetime="item[column.prop]" date-style="short" time-style="short" />
            </template>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>
