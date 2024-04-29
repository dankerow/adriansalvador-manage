export default defineNuxtConfig({
  rootDir: './',
  srcDir: 'src',

  typescript: {
    strict: true
  },

  nitro: {
    minify: true,
    experimental: {
      typescriptBundlerResolution: true
    }
  },

  experimental: {
    typedPages: true
  },

  build: {
    transpile: ['xlsx']
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        dir: 'auto'
      },
      meta: [
        { name: 'description', content: '' },
        { name: 'robots', content: 'noydir,noodp,noarchive,nocache,notranslate,nofollow,noimageindex,noindex' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://cdn.salvadoradrian.com' },
        { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' }
      ],
      script: [
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js',
          type: 'text/javascript',
          defer: true
        }
      ]
    }
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
      { name: 'Karla', weights: [400, 500, 600, 700, 800, 900] }
    ],
  },

  $development: {
    debug: true,
    sourcemap: true,

    runtimeConfig: {
      public: {
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
        /^pswp/,
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
