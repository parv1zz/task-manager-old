import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
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
  icons: {
    defaultSet: 'mdi',
  },
  labComponents: ['VTimePicker']
})