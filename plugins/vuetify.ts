// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { VTimePicker } from 'vuetify/labs/VTimePicker'

import { en, ru } from 'vuetify/locale'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    display: {
      mobileBreakpoint: 'sm',
      thresholds: {
        xs: 320,
        sm: 600,
        md: 880,
        lg: 1280,
        xl: 1920,
      }
    },
    components: {
      VTimePicker,
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    locale: {
      locale: 'en',
      messages: { en, ru },
    },
  })
  app.vueApp.use(vuetify)
})