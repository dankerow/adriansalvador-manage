export default defineNuxtConfig({
	rootDir: './',
	srcDir: 'src',

	debug: process.env.NODE_ENV === 'development',

	runtimeConfig: {
		public: {
			apiBaseURL: process.env.NODE_ENV === 'production' ? process.env.API_BASE_URL : process.env.API_BASE_URL_DEV,
			cdnBaseURL: process.env.NODE_ENV === 'production' ? process.env.CDN_BASE_URL : process.env.CDN_BASE_URL_DEV
		}
	},

	css: [
		'@/assets/scss/bedrock.scss'
	],

	hooks: {
		'pages:extend': (pages) => {
			pages.forEach((page) => {
				if (page.path === '/dashboard') {
					Object.assign(page, { name: 'dashboard', path: '/' })
				}
			})
		}
	},

	modules: [
		'@nuxt/image-edge',
		'@nuxtjs/color-mode',
		'@nuxtjs/fontaine',
		'@nuxtjs/google-fonts',
		'@pinia/nuxt',
		'nuxt-icon',
		'nuxt-purgecss'
	],

	colorMode: {
		preference: 'system',
		fallback: 'dark'
	},

	googleFonts: {
		families: {
			Archivo: {
				wght: [400, 500, 600, 700, 800, 900]
			}
		},
		display: 'swap'
	},

	image: {
		domains: [process.env.NODE_ENV === 'production' ? process.env.CDN_BASE_URL : process.env.CDN_BASE_URL_DEV]
	},

	purgecss: {
		variables: true
	}
})
