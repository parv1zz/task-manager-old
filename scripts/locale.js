import { calendarApi } from "./calendar"
import { vuetify } from "./vuetify"

export function t(name) {
  const nuxtApp = useNuxtApp()
  return nuxtApp.$i18n.t(name)
}

export const appLocale = ref('en') // default locale
export const locales = ref(['en', 'ru'])
watch(appLocale, (n, o) => {
  changeLocale(n)
})
export function getLocale() {
  if(localStorage.getItem('locale')) {
    appLocale.value = localStorage.getItem('locale')
  }
  changeLocale(appLocale.value)
}

export function changeLocale(locale) {
  // i18n
  const nuxtApp = useNuxtApp()
  nuxtApp.$i18n.setLocale(locale)

  // vuetify
  vuetify.locale.current = locale

  // calendar
  calendarApi.setOption('locale', locale)
  calendarApi.setOption('firstDay', locale == 'en' ? 0 : 1)
  calendarApi.setOption('weekText', locale == 'en' ? 'W' : 'H')
  
  localStorage.setItem('locale', locale)
}