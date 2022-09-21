export default function({ app, $axios, $cookies }) {
	$axios.onRequest((config) => {
		const token = $cookies.get('session') ? $cookies.get('session').token : null
		if (token) {
			config.headers.common.Authorization = `bearer ${token}`
		}
	})

	$axios.onError((error) => {
		if (process.env.NODE_ENV !== 'production') console.error('[AXIOS Error]', error)
		if (process.browser) {
			if (process.env.NODE_ENV !== 'production') {
				if (error.response?.data?.error?.message) {
					const toast = new app.$Toast({
						title: 'Something went wrong!',
						body: error.response.data.error.message
					})
				} else {
					const toast = new app.$Toast({
						title: 'Something went wrong!',
						body: error.message
					})
				}
			}
		}
	})
}
