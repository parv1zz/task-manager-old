export function t(name) {
  const nuxtApp = useNuxtApp()
  return nuxtApp.$i18n.t(name)
}

export function getDatePattern(locale) {
  if(locale == 'en') {
    return 'mm/dd/yyyy'
  } else if(locale == 'ru') {
    return 'дд.мм.гггг'
  }
}

export function getTimePattern(locale) {
  if(locale == 'en') {
    return 'h:m a/p'
  } else if(locale == 'ru') {
    return 'чч:мм'
  }
}