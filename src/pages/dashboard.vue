<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAlbumsStore } from '@/stores/albums'
import { useAnalyticsStore } from '@/stores/analytics'

const albumsStore = useAlbumsStore()
const analyticsStore = useAnalyticsStore()

const audits = ref([])

const table = ref({
  columns: [
    {
      label: 'Name',
      prop: 'name'
    },
    {
      label: 'File Count',
      prop: 'fileCount'
    },
    {
      label: 'Hidden',
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
      label: 'Created on',
      prop: 'createdAt'
    },
    {
      label: 'Modified On',
      prop: 'modifiedAt'
    }
  ]
})

const { albums, count: albumCount, pages: albumsPages, loading: albumsLoading } = storeToRefs(albumsStore)
const { pageViews, imageCount } = storeToRefs(analyticsStore)

const { data: albumsData, pending: albumsPending } = await useLazyAsyncData('albums', () => albumsStore.getAlbums({ setData: true }))
const { data: analayticsData, pending: analyticsPending } = await useLazyAsyncData('analytics', () => analyticsStore.fetchAnalytics())

const loadAlbums = async (options?: { limit: number, page: number }) => {
  albumsLoading.value = false

  const { data } = await albumsStore.getAlbums(options)

  albums.value = data.albums
  albumCount.value = data.count
  albumsPages.value = data.pages

  albumsLoading.value = false
}
</script>

<template>
  <div>
    <Banner
      :links="[{ name: 'Dashboard' }]"
      icon="ic:twotone-home"
      :body="{ class: 'row row-cols-1 row-cols-lg-4 mt-2' }"
    >
      <template #body>
        <div class="col">
          <CardsStats title="Albums" :description="albumCount" :icon="{ name: 'ic:twotone-photo-album', color: 'red', url: '/albums' }" />
        </div>

        <div class="col">
          <CardsStats title="Images" :description="imageCount" :icon="{ name: 'ph:image-duotone', color: 'blue', url: '/albums' }" />
        </div>

        <div class="col">
          <CardsStats title="Views" :description="pageViews" :icon="{ name: 'ph:eye-duotone', color: 'indigo', url: '/analytics' }" />
        </div>

        <div class="col">
          <CardsStats title="Downloads" :description="298" :icon="{ name: 'ph:file-arrow-down-duotone', color: 'orange', url: '/analytics' }" />
        </div>
      </template>
    </Banner>

    <div class="container-fluid">
      <div class="row row-cols-1 row-cols-lg-2">
        <div class="col col-lg-8 mt-n4">
          <DataTable title="Albums" :loading="albumsLoading" :data="albums" :columns="table.columns" :pagination="{ count: albumCount, pages: albumsPages }" @load-data="loadAlbums">
            <template #item-name="{ item, column }">
              <NuxtLink :to="`/albums/${item.id}`">
                {{ item[column.prop] }}
              </NuxtLink>
            </template>

            <template #item-hidden="{ item, column }">
              <span v-if="item[column.prop]">
                <Icon name="ph:eye-slash-duotone" />
              </span>
              <span v-else>
                <Icon name="ph:eye-duotone" class="opacity-50" />
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

        <div class="col col-lg-4 mt-lg-n4">
          <div class="row row-cols-1">
            <div class="col">
              <div class="card">
                <div class="card-header">
                  <div class="row row-cols-2 align-items-center">
                    <div class="col">
                      <h1 class="h3 mb-0">
                        Recent Activities
                      </h1>
                    </div>

                    <div class="col">
                      <NuxtLink
                        to="/"
                        class="btn btn-sm btn-primary float-end"
                        :class="{ disabled: !audits.length }"
                        :disabled="!audits.length"
                      >
                        View all
                      </NuxtLink>
                    </div>
                  </div>
                </div>

                <div class="card-body">
                  <template v-if="audits.length">
                    <div
                      v-for="(audit, index) in audits"
                      :key="index"
                      :class="`d-flex align-baseline ${index === 0 ? 'pb-3' : 'py-3'} ${index !== audits.length - 1 ? 'border-bottom' : ''}`"
                    >
                      <div class="d-inline-block me-3">
                        <template v-if="audit.type === 1">
                          <div class="icon icon-sm icon-shape icon-shape-green shadow-sm">
                            <Icon name="ic:baseline-add" />
                          </div>
                        </template>
                        <template v-else-if="audit.type === 2">
                          <div class="icon icon-sm icon-shape icon-shape-orange shadow-sm">
                            <Icon name="ic:baseline-edit" />
                          </div>
                        </template>
                        <template v-else-if="audit.type === 3">
                          <div class="icon icon-sm icon-shape icon-shape-red shadow-sm">
                            <Icon name="ic:baseline-delete" />
                          </div>
                        </template>
                      </div>

                      <div class="d-inline-block">
                        <h6 class="mb-0">
                          {{ audit.transactionDate }}
                        </h6>

                        <p class="fs-4 mb-0">
                          {{ audit.user.firstName }} {{ audit.user.lastName[0] }}.
                          <template v-if="audit.type === 1">
                            added
                          </template>
                          <template v-else-if="audit.type === 2">
                            edited
                          </template>
                          <template v-else-if="audit.type === 3">
                            deleted
                          </template>

                          an asset
                        </p>
                      </div>
                    </div>
                  </template>

                  <template v-else>
                    <div class="alert alert-sm alert-primary" role="alert">
                      <strong>No records at the moment.</strong>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
