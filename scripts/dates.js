export function checkDays(day1, day2) {
  return new Date(new Date(day1).toLocaleDateString('en')).getTime() == new Date(new Date(day2).toLocaleDateString('en')).getTime()
}

import { t } from './locale'

export function getDatesDuration(date1, date2) {
  let diffTime = new Date(date2) - new Date(date1)
  let diffMins = String(diffTime / (1000*60))
  let diffHours = String(diffTime / (1000*60*60))
  let diffDays = String(diffTime / (1000*60*60*24))
  let days = Math.floor(diffHours / 24)
  let hours = days >= 1 ? (diffHours - days*24) : diffHours
  let mins = Math.round(hours % 1 * 60)
  hours = Math.floor(hours)

  return (days >= 1 ? `${days} ${t('days')} ${hours != 0 ? hours + ' ' + t('hours') : ''} ${mins != 0 ? mins + ' ' + t('mins') : ''}` : `${hours} ${t('hours')} ${mins != 0 ? mins + ' ' + t('mins') : ''}`)
}