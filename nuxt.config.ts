export default defineNuxtConfig({
  rootDir: './',
  srcDir: 'src',

  typescript: {
    strict: true
  },

  experimental: {
    typedPages: true
  },

  css: [
    '@/assets/scss/bedrock.scss'
  ],

  modules: [
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/critters',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon',
    'nuxt-time'
  ],

  colorMode: {
    preference: 'dark',
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

  pinia: {
    autoImports: [
      'defineStore',
      'acceptHMRUpdate'
    ]
  },

  $development: {
    debug: true,
    sourcemap: true,

    runtimeConfig: {
      public: {
        apiBaseURL: process.env.API_BASE_URL_DEV,
        cdnBaseURL: process.env.CDN_BASE_URL_DEV
      }
    },
    modules: [
      '@nuxt/devtools'
    ],
    image: {
      domains: [process.env.CDN_BASE_URL_DEV as string]
    }
  },

  $production: {
    runtimeConfig: {
      public: {
        apiBaseURL: process.env.API_BASE_URL,
        cdnBaseURL: process.env.CDN_BASE_URL
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
        /^dropdown/
      ]
    }
  }
})
