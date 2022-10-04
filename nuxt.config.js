import shrinkRay from 'shrink-ray-current'

export default {
	rootDir: './',
	srcDir: 'src',
	modern: process.env.NODE_ENV === 'production',
	server: {
		port: process.env.SERVER_PORT
	},
	publicRuntimeConfig: {
		apiBaseURL: process.env.NODE_ENV === 'production' ? process.env.API_BASE_URL : process.env.API_BASE_URL_DEV,
		cdnBaseURL: process.env.NODE_ENV === 'production' ? process.env.CDN_BASE_URL : process.env.CDN_BASE_URL_DEV
	},
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'Adrian Salvador - Manage',
		titleTemplate: 'Adrian Salvador - Manage | %s',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' },
			{ name: 'format-detection', content: 'telephone=no' },
			{ name: 'robots', content: 'noydir,noodp,noarchive,nocache,notranslate,nofollow,noimageindex,noindex' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{ rel: 'preconnect', href: 'https://cdn.salvadoradrian.com' },
			{ rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' }
		],
		script: [
			{
				src: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.2.1/js/bootstrap.bundle.min.js',
				type: 'text/javascript',
				defer: true
			}
		]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
		'~/assets/scss/bedrock'
	],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		'~/plugins/axios',
		{ src: '~/plugins/toast.js', mode: 'client' }
	],

	router: {
		middleware: ['auth']
	},

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/eslint
		'@nuxtjs/eslint-module',
		'@nuxtjs/google-fonts',
		'cookie-universal-nuxt'
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		'@nuxt/image',
		'@nuxtjs/color-mode',
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		// https://go.nuxtjs.dev/pwa
		'@nuxtjs/pwa',
		'@nuxtjs/svg',
		'nuxt-purgecss'
	],

	proxy: {
		'/api': {
			target: process.env.NODE_ENV === 'production' ? process.env.API_BASE_URL : process.env.API_BASE_URL_DEV,
			pathRewrite: { '^/api/': '' },
			preserveHeaderKeyCase: true,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST'
			}
		},
		'/cdn': {
			target: process.env.NODE_ENV === 'production' ? process.env.CDN_BASE_URL : process.env.CDN_BASE_URL_DEV,
			pathRewrite: { '^/cdn/': '' },
			preserveHeaderKeyCase: true,
			headers: {
				'Accept': 'application/vnd.adriansalvador.json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST'
			}
		}
	},

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {
		proxy: true,
		retry: { retries: 2 },
		credentials: true,
		headers: {
			common: {
				'Accept': 'application/vnd.adriansalvador.json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST'
			}
		}
	},

	colorMode: {
		preference: 'system',
		fallback: 'dark',
		hid: 'color-mode-script',
		globalName: '__COLOR_MODE__',
		storageKey: 'color-mode'
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

	purgeCSS: {
		variables: true
	},

	// PWA module configuration: https://go.nuxtjs.dev/pwa
	pwa: {
		meta: {
			mobileApp: true,
			name: 'Adrian Salvador - Manage',
			appleStatusBarStyle: '#1b1b1b'
		},
		manifest: {
			name: 'Adrian Salvador - Manage',
			// eslint-disable-next-line camelcase
			start_url: '/',
			// eslint-disable-next-line camelcase
			short_name: 'AS - Manage',
			lang: 'en',
			display: 'fullscreen',
			// eslint-disable-next-line camelcase
			background_color: '#1b1b1b',
			// eslint-disable-next-line camelcase
			theme_color: '#909090'
		},
		workbox: {
			enabled: false
		}
	},

	render: {
		asyncScripts: true,
		compressor: shrinkRay({ brotli: { level: 9, threshold: 8192 } })
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		devtools: true,
		extractCSS: true,
		html: {
			minify: {
				collapseBooleanAttributes: true,
				decodeEntities: true,
				minifyCSS: true,
				minifyJS: true,
				processConditionalComments: true,
				removeEmptyAttributes: true,
				removeRedundantAttributes: true,
				trimCustomFragments: true,
				useShortDoctype: true,
				removeComments: true
			}
		},
		publicPath: '/_/',
		babel: {
			presets({ isServer }, [, options]) {
				options.corejs = {
					...options.corejs,
					version: 3
				}
			}
		}
	}
}
