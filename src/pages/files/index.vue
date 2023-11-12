<script setup lang="ts">
import { useFilesStore } from '@/stores/files'

const { files, loading, count, pages, getFiles, deleteFiles } = useFilesStore()

const dataTable = ref()
const table = ref({
  rows: files,
  columns: [
    {
      label: 'Name',
      prop: 'name',
      sortable: true
    },
    {
      label: 'Created On',
      prop: 'createdAt'
    },
    {
      label: 'Modified On',
      prop: 'modifiedAt'
    }
  ],
  pagination: {
    count,
    pages
  }
})

const loadFiles = async (options?: { page: number, search?: string, limit?: number, sort?: { by?: string, order?: string } }) => {
  const data = await getFiles(options)

  table.value.rows = data.files
  table.value.pagination = {
    count: data.count,
    pages: data.pages
  }
}

if (files.length === 0) {
  await loadFiles()
}

const getSelectedRows = computed(() => {
  return dataTable.value?.selectedRows
})

const deleteSelectedFiles = async () => {
  const selectedRows = getSelectedRows.value

  if (selectedRows.length === 0) {
    return
  }

  const ids = selectedRows.map((row: any) => row.id)

  await deleteFiles(ids)

  dataTable.value?.deselectAllRows()

  await loadFiles()
}
</script>

<template>
  <div>
    <Banner
      :links="[{ name: 'Files' }]"
      icon="ic:twotone-folder"
      title="Files"
      :buttons="[
        { name: 'new-file', text: 'Upload files', url: '/files/upload', icon: 'ic:twotone-add' },
        { name: 'delete-selected-files', text: 'Delete Selected Files', callback: deleteSelectedFiles, disabled: !getSelectedRows?.length, icon: 'ic:twotone-delete' }
      ]"
    />

    <div class="container-fluid mt-n4">
      <div class="row">
        <div class="col">
          <DataTable
            ref="dataTable"
            selection
            multiple-selection
            :loading="loading"
            :data="table.rows"
            :columns="table.columns"
            :pagination="table.pagination"
            @load-data="loadFiles"
          >
            <template #item-name="{ item, column }">
              <NuxtLink :to="`/files/${item.id}`">
                {{ item[column.prop] }}
              </NuxtLink>
            </template>

            <template #item-created-on="{ item, column }">
              <NuxtTime :datetime="item[column.prop]" date-style="short" time-style="short" />
            </template>

            <template #item-modified-on="{ item, column }">
              <NuxtTime :datetime="item[column.prop]" date-style="short" time-style="short" />
            </template>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>
