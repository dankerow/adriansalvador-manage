<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAnalyticsStore } from '@/stores/analytics'

const analyticsStore = useAnalyticsStore()

const { pageViews, totalVisitors, newVisitors, engagementRate, popularPages, trendingPages, loading } = storeToRefs(analyticsStore)

await analyticsStore.fetchAnalytics()

const tablePopularPages = ref({
	columns: [
		{
			label: 'Page Title',
			prop: 'pageTitle',
			cellOptions: {
				link: true
			}
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
})
</script>

<template>
	<div>
		<Banner title="analytics" icon="ic:twotone-pie-chart" :body="{ class: 'row row-cols-1 row-cols-lg-4 mt-4' }">
			<template #body>
				<div class="col">
					<CardsStats title="Page views" :description="pageViews" :icon="{ name: 'ph:eye-duotone', color: 'indigo' }" />
				</div>

				<div class="col">
					<CardsStats title="Total visitors" :description="totalVisitors" :icon="{ name: 'ph:users-four-duotone', color: 'indigo' }" />
				</div>

				<div class="col">
					<CardsStats title="New visitors" :description="newVisitors" :icon="{ name: 'ph:user-plus-duotone', color: 'indigo' }" />
				</div>

				<div class="col">
					<CardsStats title="Engagement rate" :description="`${(engagementRate * 100).toFixed(2)}%`" :icon="{ name: 'ph:mouse-simple-duotone', color: 'indigo' }" />
				</div>
			</template>
		</Banner>

		<div class="container-fluid mt-n4">
			<div class="row gy-4">
				<div class="col-12">
					<DataTable :loading="loading" title="popular pages" :data="popularPages" :columns="tablePopularPages.columns" :pagination="{ count: popularPages.length, pages: 1 }" />
				</div>

				<div class="col-12">
					<DataTable :loading="loading" title="trending pages" :data="trendingPages" :columns="tablePopularPages.columns" :pagination="{ count: trendingPages.length, pages: 1 }" />
				</div>
			</div>
		</div>
	</div>
</template>
