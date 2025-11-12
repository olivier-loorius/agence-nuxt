export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@vueuse/motion/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/i18n',
    // '@nuxt/content',
    // 'nuxt-seo'
  ],

  i18n: {
    defaultLocale: 'fr',
    locales: [
      {
        code: 'fr',
        file: 'fr.json',
      },
    ],
    langDir: 'locales',
    strategy: 'no_prefix',
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    head: {
      title: 'AgenceO - Agence Web pour Artisans',
      meta: [
        {
          name: 'description',
          content: 'AgenceO est une agence web spécialisée dans la création de sites modernes pour artisans. Présence en ligne, design personnalisé et stratégie digitale.',
        },
        {
          name: 'keywords',
          content: 'développeur web indépendant, site vitrine artisan, site sur-mesure TPE, création site web accessible',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap',
          as: 'style',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  compatibilityDate: '2025-11-02',
})