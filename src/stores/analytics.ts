interface Analytics {
  basic: {
    pageViews: number
    totalVisitors: number
    newVisitors: number
    engagementRate: number
  }
  popular: string[]
  trending: string[]
}

export const useAnalyticsStore = defineStore('analytics', () => {
  const pageViews = ref<number>(0)
  const newVisitors = ref<number>(0)
  const totalVisitors = ref<number>(0)
  const engagementRate = ref<number>(0)
  const popularPages = ref<string[]>([])
  const trendingPages = ref<string[]>([])

  const fetchAnalytics = async () => {
    try {
      const data = await useFaetch<Analytics>('/analytics')

      pageViews.value = data.basic.pageViews
      totalVisitors.value = data.basic.totalVisitors
      newVisitors.value = data.basic.newVisitors
      engagementRate.value = data.basic.engagementRate
      popularPages.value = data.popular
      trendingPages.value = data.trending

      return { data, error: null }
    } catch (e) {
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
