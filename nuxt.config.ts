export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-09-08',
  devtools: { enabled: true },
  css: ['~/assets/scss/main.scss'],
  modules: [
    '@nuxtjs/i18n',
    'vuetify-nuxt-module',
    '@samk-dev/nuxt-vcalendar',
    '@nuxtjs/tailwindcss'
  ],
  vuetify: {
    moduleOptions: {},
    vuetifyOptions: './vuetify.config.ts'
  },
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
      },
      {
        code: 'ru',
        name: 'Русский',
      },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    vueI18n: './i18n.config.ts',
  },
  vcalendar: {
    prefix: 'vc'
  }
})