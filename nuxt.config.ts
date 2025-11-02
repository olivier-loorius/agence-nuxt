export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content', 
    '@nuxt/image',   
    'nuxt-seo'       
  ],

  css: ['~/assets/css/tailwind.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: '2025-11-02',
  tailwindcss: {
    config: {
      plugins: [require('tailwindcss-animate')]
    }
  }
})