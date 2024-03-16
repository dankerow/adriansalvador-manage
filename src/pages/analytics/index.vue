<script setup lang="ts">
import { useAnalyticsStore } from '@/stores/analytics'

useHead({
  title: 'Analytics',
  meta: [
    {
      name: 'description',
      content: 'Analytics'
    }
  ]
})

const authStore = useAnalyticsStore()

const { pending: analyticsPending } = await useLazyAsyncData(
  'analytics',
  () => authStore.fetchAnalytics(),
  {
    deep: false
  }
)

const tablePopularPages = {
  columns: [
    {
      label: 'Page Title',
      prop: 'pageTitle'
    },
    {
      label: '# Views',
      prop: 'screenPageViews'
    },
    {
      label: 'Path',
      prop: 'path'
    }
  ]
}
</script>

<template>
  <div>
    <Banner
      title="Analytics"
      :links="[
        { name: 'Analytics' }
      ]"
    />

    <div class="container-fluid">
      <div class="row row-cols-1 row-cols-lg-4 mb-4">
        <div class="col">
          <CardsStats title="Page views" :description="authStore.pageViews" :icon="{ name: 'ph:eye-duotone', color: 'indigo' }" />
        </div>

        <div class="col">
          <CardsStats title="Total visitors" :description="authStore.totalVisitors" :icon="{ name: 'ph:users-four-duotone', color: 'indigo' }" />
        </div>

        <div class="col">
          <CardsStats title="New visitors" :description="authStore.newVisitors" :icon="{ name: 'ph:user-plus-duotone', color: 'indigo' }" />
        </div>

        <div class="col">
          <CardsStats title="Engagement rate" :description="`${(authStore.engagementRate * 100).toFixed(2)}%`" :icon="{ name: 'ph:mouse-simple-duotone', color: 'indigo' }" />
        </div>
      </div>

      <div class="row gy-4">
        <div class="col-12">
          <DataTable :loading="analyticsPending" title="popular pages" :data="authStore.popularPages" :columns="tablePopularPages.columns" :pagination="{ count: authStore.popularPages.length, pages: 1 }" />
        </div>

        <div class="col-12">
          <DataTable :loading="analyticsPending" title="trending pages" :data="authStore.trendingPages" :columns="tablePopularPages.columns" :pagination="{ count: authStore.trendingPages.length, pages: 1 }" />
        </div>
      </div>
    </div>
  </div>
</template>
