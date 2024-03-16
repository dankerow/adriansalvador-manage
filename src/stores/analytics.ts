import type { Ref } from 'vue'

export const useAnalyticsStore = defineStore('analytics', () => {
  const pageViews: Ref<number> = ref(0)
  const newVisitors: Ref<number> = ref(0)
  const totalVisitors: Ref<number> = ref(0)
  const engagementRate: Ref<number> = ref(0)
  const popularPages: Ref<Array<string>> = ref([])
  const trendingPages: Ref<Array<string>> = ref([])

  const fetchAnalytics = async () => {
    try {
      const data = await useFaetch('/analytics')

      pageViews.value = data.basic.pageViews
      totalVisitors.value = data.basic.totalVisitors
      newVisitors.value = data.basic.newVisitors
      engagementRate.value = data.engagementRate
      popularPages.value = data.popular
      trendingPages.value = data.trending

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
    fetchAnalytics
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAnalyticsStore, import.meta.hot))
}
