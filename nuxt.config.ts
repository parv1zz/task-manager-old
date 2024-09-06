// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  css: ['~/assets/scss/main.scss'],
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@nuxtjs/i18n',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: './locales/en.json',
      },
      {
        code: 'ru',
        name: 'Russian',
        file: './locales/ru.json',
      },
    ],
    lazy: false,
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    vueI18n: './plugins/i18n.config.ts',
  },
})