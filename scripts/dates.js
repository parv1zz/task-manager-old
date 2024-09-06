import { t, appLocale } from './locale'

export function changeDateFormat(date) {
  if(appLocale.value == 'ru') {
    let date_split = String(date).split('.')
    let new_date = `${date_split[1]}/${date_split[0]}/${date_split[2]}`

    return new_date
  } else {
    return date
  }
}

export function checkDays(day1, day2) {
  return new Date(new Date(day1).toLocaleDateString('en')).getTime() == new Date(new Date(day2).toLocaleDateString('en')).getTime()
}

export function getDatesDuration(date1, date2) {
  let diffTime = new Date(date2) - new Date(date1)
  let diffHours = String(diffTime / (1000*60*60))
  let days = Math.floor(diffHours / 24)
  let hours = days >= 1 ? (diffHours - days*24) : diffHours
  let mins = Math.round(hours % 1 * 60)
  hours = Math.floor(hours)

  if(days >= 1) {
    return `${days}${t('TaskInfo.d')}${hours != 0 ? ' ' + hours + t('TaskInfo.h') : ''}${mins != 0 ? ' ' + mins + t('TaskInfo.m') : ''}`
  }
  if(hours >= 1) {
    return `${hours}${t('TaskInfo.h')}${mins != 0 ? ' ' + mins + t('TaskInfo.m') : ''}`
  }
  return `${mins + t('TaskInfo.m')}`
}

export const getDatePattern = computed({
  get() {
    if(appLocale.value == 'en') {
      return 'mm/dd/yyyy'
    } else if(appLocale.value == 'ru') {
      return 'дд.мм.гггг'
    }
  }
})

export const getTimePattern = computed({
  get() {
    if(appLocale.value == 'en') {
      return 'h:m a/p'
    } else if(appLocale.value == 'ru') {
      return 'чч:мм'
    }
  }
})