const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  rootDir: './',
  srcDir: 'src',

  debug: isDevelopment,
  sourcemap: isDevelopment,

  typescript: {
    strict: true
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

  modules: [
    '@nuxt/devtools',
    '@nuxt/image-edge',
    '@nuxtjs/color-mode',
    '@nuxtjs/critters',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon',
    'nuxt-purgecss',
    'nuxt-time',
    'nuxt-security'
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
    domains: [isProduction ? process.env.CDN_BASE_URL as string : process.env.CDN_BASE_URL_DEV as string]
  },

  pinia: {
    autoImports: [
      'defineStore',
      'acceptHMRUpdate'
    ]
  },

  purgecss: {
    safelist: [
      'dark-mode',
      'svg',
      /^btn-/,
      /^dropdown/
    ]
  },

  security: {
    enabled: isProduction
  }
})
