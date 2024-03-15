export default defineNuxtConfig({
  rootDir: './',
  srcDir: 'src',

  typescript: {
    strict: true
  },

  experimental: {
    typedPages: true
  },

  build: {
    transpile: ['xlsx']
  },

  css: [
    '@/assets/scss/bedrock.scss'
  ],

  modules: [
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/critters',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon',
    'nuxt-time'
  ],

  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },

  fonts: {
    experimental: {
      processCSSVariables: true
    },
    families: [
      { name: 'Archivo', weights: [400, 500, 600, 700, 800, 900] }
    ],
  },

  $development: {
    debug: true,
    sourcemap: true,

    runtimeConfig: {
      public: {
        apiBaseUrl: process.env.API_BASE_URL_DEV,
        cdnBaseUrl: process.env.CDN_BASE_URL_DEV
      }
    },

    image: {
      domains: [process.env.CDN_BASE_URL_DEV as string]
    }
  },

  $production: {
    runtimeConfig: {
      public: {
        apiBaseUrl: process.env.API_BASE_URL,
        cdnBaseUrl: process.env.CDN_BASE_URL
      }
    },

    modules: [
      'nuxt-purgecss',
      'nuxt-security'
    ],

    image: {
      domains: [process.env.CDN_BASE_URL as string]
    },

    purgecss: {
      safelist: [
        'dark-mode',
        'svg',
        /^btn-/,
        /^dropdown/,
        /^filepond/
      ]
    },

    security: {
      headers: {
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
          'img-src': ['\'self\'', 'https:', 'http:', 'data:', 'blob:'],
          'upgrade-insecure-requests': true
        },
      },
      rateLimiter: false
    }
  }
})
