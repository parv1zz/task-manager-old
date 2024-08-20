export function t(name) {
  const nuxtApp = useNuxtApp()
  return nuxtApp.$i18n.t(name)
}