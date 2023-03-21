const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
	rootDir: './',
	srcDir: 'src',

	debug: isDevelopment,
	sourcemap: isDevelopment,

	nitro: {
		prerender: {
			crawlLinks: true
		}
	},

	runtimeConfig: {
		public: {
			apiBaseURL: isProduction ? process.env.API_BASE_URL : process.env.API_BASE_URL_DEV,
			cdnBaseURL: isProduction ? process.env.CDN_BASE_URL : process.env.CDN_BASE_URL_DEV
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
		'@nuxt/devtools',
		'@nuxt/image-edge',
		'@nuxtjs/color-mode',
		'@nuxtjs/google-fonts',
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'nuxt-icon',
		'nuxt-purgecss',
		'nuxt-time'
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
		domains: [isProduction ? process.env.CDN_BASE_URL : process.env.CDN_BASE_URL_DEV]
	},

	pinia: {
		autoImports: [
			'defineStore',
			'acceptHMRUpdate'
		]
	},

	purgecss: {
		variables: true
	}
})
