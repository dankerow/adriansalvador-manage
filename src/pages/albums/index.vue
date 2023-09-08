<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAlbumsStore } from '@/stores/albums'

const albumsStore = useAlbumsStore()

const { albums, loading, count, pages } = storeToRefs(albumsStore)

const table = ref({
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
  ]
})

if (albumsStore.albums.length === 0) {
  await albumsStore.getAlbums()
}

const dataTable = ref()

const loadAlbums = async (options?: { page: number, search?: string, limit?: number, sort?: { by?: string, order?: string } }) => {
  loading.value = true

  const data = await albumsStore.getAlbums(options)

  albums.value = data.albums
  count.value = data.count
  pages.value = data.pages

  loading.value = false
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

  await albumsStore.deleteAlbums(ids)

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
            :data="albums"
            :columns="table.columns"
            :pagination="{ count, pages }"
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
