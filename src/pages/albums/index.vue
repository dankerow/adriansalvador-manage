<script setup lang="ts">
import { useAlbumsStore } from '@/stores/albums'

const { albums, loading, count, pages, getAlbums, deleteAlbums } = useAlbumsStore()

const dataTable = ref()
const table = ref({
  rows: albums,
  columns: [
    {
      label: 'Name',
      prop: 'name',
      sortable: true
    },
    {
      label: 'File Count',
      prop: 'fileCount'
    },
    {
      label: 'hidden',
      prop: 'hidden'
    },
    {
      label: 'NSFW',
      prop: 'nsfw'
    },
    {
      label: 'Favorite',
      prop: 'favorite'
    },
    {
      label: 'Featured',
      prop: 'featured'
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

const loadAlbums = async (options?: { page: number, search?: string, limit?: number, sort?: { by?: string, order?: string } }) => {
  const data = await getAlbums(options)

  table.value.rows = data.albums
  table.value.pagination = {
    count: data.count,
    pages: data.pages
  }
}

if (albums.length === 0) {
  await loadAlbums()
}

const getSelectedRows = computed(() => {
  return dataTable.value?.selectedRows
})

const deleteSelectedAlbums = async () => {
  const selectedRows = getSelectedRows.value

  if (selectedRows.length === 0) {
    return
  }

  const ids = selectedRows.map((row: any) => row.id)

  await deleteAlbums(ids)

  dataTable.value?.deselectAllRows()

  await loadAlbums()
}
</script>

<template>
  <div>
    <Banner
      :links="[{ name: 'Albums' }]"
      icon="ic:twotone-folder"
      title="Albums"
      :buttons="[
        { name: 'new-album', text: 'New album', url: '/albums/add', icon: 'ic:twotone-add' },
        { name: 'delete-selected-albums', text: 'Delete Selected Albums', callback: deleteSelectedAlbums, disabled: !getSelectedRows?.length, icon: 'ic:twotone-delete' }
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
            @load-data="loadAlbums"
          >
            <template #item-name="{ item, column }">
              <NuxtLink :to="`/albums/${item.id}`">
                {{ item[column.prop] }}
              </NuxtLink>
            </template>

            <template #item-hidden="{ item, column }">
              <span v-if="item[column.prop]">
                <Icon name="ph:eye-duotone" />
              </span>
              <span v-else>
                <Icon name="ph:eye-slash-duotone" class="opacity-50" />
              </span>
            </template>

            <template #item-nsfw="{ item, column }">
              <span v-if="item[column.prop]">
                <Icon name="ph:check-square-duotone" />
              </span>
              <span v-else>
                <Icon name="ph:x-square-duotone" class="opacity-50" />
              </span>
            </template>

            <template #item-favorite="{ item, column }">
              <span v-if="item[column.prop]">
                <Icon name="ph:star-fill" />
              </span>
              <span v-else>
                <Icon name="ph:star-duotone" class="opacity-50" />
              </span>
            </template>

            <template #item-featured="{ item, column }">
              <span v-if="item[column.prop]">
                <Icon name="ph:star-fill" />
              </span>
              <span v-else>
                <Icon name="ph:star-duotone" class="opacity-50" />
              </span>
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
