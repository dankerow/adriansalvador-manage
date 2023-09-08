import type { Ref } from 'vue'

export const useAnalyticsStore = defineStore('analytics', () => {
  const pageViews: Ref<number> = ref(0)
  const newVisitors: Ref<number> = ref(0)
  const totalVisitors: Ref<number> = ref(0)
  const engagementRate: Ref<number> = ref(0)
  const popularPages: Ref<Array<string>> = ref([])
  const trendingPages: Ref<Array<string>> = ref([])
  const loading: Ref<boolean> = ref(false)

  const fetchAnalytics = async () => {
    try {
      loading.value = true

      const data = await useFaetch('/analytics')

      pageViews.value = data.basic.pageViews
      totalVisitors.value = data.basic.totalVisitors
      newVisitors.value = data.basic.newVisitors
      engagementRate.value = data.engagementRate
      popularPages.value = data.popular
      trendingPages.value = data.trending

      loading.value = false

      return { data, error: null }
    } catch (e: any) {
      return { error: e.data ? e.data.error : e }
    }
  }

  return {
    pageViews,
    totalVisitors,
    newVisitors,
    engagementRate,
    popularPages,
    trendingPages,
    loading,
    fetchAnalytics
  }
})
