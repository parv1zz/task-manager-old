import { t, appLocale } from './locale'
import { formValues } from './form'

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
      return 'hh:mm a/p'
    } else if(appLocale.value == 'ru') {
      return 'чч:мм'
    }
  }
})

export let timesEn = [
  '12:00 AM',
  '12:15 AM',
  '12:30 AM',
  '12:45 AM',
  '1:00 AM',
  '1:15 AM',
  '1:30 AM',
  '1:45 AM',
  '2:00 AM',
  '2:15 AM',
  '2:30 AM',
  '2:45 AM',
  '3:00 AM',
  '3:15 AM',
  '3:30 AM',
  '3:45 AM',
  '4:00 AM',
  '4:15 AM',
  '4:30 AM',
  '4:45 AM',
  '5:00 AM',
  '5:15 AM',
  '5:30 AM',
  '5:45 AM',
  '6:00 AM',
  '6:15 AM',
  '6:30 AM',
  '6:45 AM',
  '7:00 AM',
  '7:15 AM',
  '7:30 AM',
  '7:45 AM',
  '8:00 AM',
  '8:15 AM',
  '8:30 AM',
  '8:45 AM',
  '9:00 AM',
  '9:15 AM',
  '9:30 AM',
  '9:45 AM',
  '10:00 AM',
  '10:15 AM',
  '10:30 AM',
  '10:45 AM',
  '11:00 AM',
  '11:15 AM',
  '11:30 AM',
  '11:45 AM',
  '12:00 PM',
  '12:15 PM',
  '12:30 PM',
  '12:45 PM',
  '1:00 PM',
  '1:15 PM',
  '1:30 PM',
  '1:45 PM',
  '2:00 PM',
  '2:15 PM',
  '2:30 PM',
  '2:45 PM',
  '3:00 PM',
  '3:15 PM',
  '3:30 PM',
  '3:45 PM',
  '4:00 PM',
  '4:15 PM',
  '4:30 PM',
  '4:45 PM',
  '5:00 PM',
  '5:15 PM',
  '5:30 PM',
  '5:45 PM',
  '6:00 PM',
  '6:15 PM',
  '6:30 PM',
  '6:45 PM',
  '7:00 PM',
  '7:15 PM',
  '7:30 PM',
  '7:45 PM',
  '8:00 PM',
  '8:15 PM',
  '8:30 PM',
  '8:45 PM',
  '9:00 PM',
  '9:15 PM',
  '9:30 PM',
  '9:45 PM',
  '10:00 PM',
  '10:15 PM',
  '10:30 PM',
  '10:45 PM',
  '11:00 PM',
  '11:15 PM',
  '11:30 PM',
  '11:45 PM',
]

export const timesEnFiltered = computed({
  get() {
    return formValues.value.filterValue == '' ? timesEn : timesEn.filter(v => v.startsWith(formValues.value.filterValue))
  }
}) 

export let timesRu = [
  '00:00',
  '00:15',
  '00:30',
  '00:45',
  '1:00',
  '1:15',
  '1:30',
  '1:45',
  '2:00',
  '2:15',
  '2:30',
  '2:45',
  '3:00',
  '3:15',
  '3:30',
  '3:45',
  '4:00',
  '4:15',
  '4:30',
  '4:45',
  '5:00',
  '5:15',
  '5:30',
  '5:45',
  '6:00',
  '6:15',
  '6:30',
  '6:45',
  '7:00',
  '7:15',
  '7:30',
  '7:45',
  '8:00',
  '8:15',
  '8:30',
  '8:45',
  '9:00',
  '9:15',
  '9:30',
  '9:45',
  '10:00',
  '10:15',
  '10:30',
  '10:45',
  '11:00',
  '11:15',
  '11:30',
  '11:45',
  '12:00',
  '12:15',
  '12:30',
  '12:45',
  '13:00',
  '13:15',
  '13:30',
  '13:45',
  '14:00',
  '14:15',
  '14:30',
  '14:45',
  '15:00',
  '15:15',
  '15:30',
  '15:45',
  '16:00',
  '16:15',
  '16:30',
  '16:45',
  '17:00',
  '17:15',
  '17:30',
  '17:45',
  '18:00',
  '18:15',
  '18:30',
  '18:45',
  '19:00',
  '19:15',
  '19:30',
  '19:45',
  '20:00',
  '20:15',
  '20:30',
  '20:45',
  '21:00',
  '21:15',
  '21:30',
  '21:45',
  '22:00',
  '22:15',
  '22:30',
  '22:45',
  '23:00',
  '23:15',
  '23:30',
  '23:45',
]

export const timesRuFiltered = computed({
  get() {
    return formValues.value.filterValue == '' ? timesRu : timesRu.filter(v => v.startsWith(formValues.value.filterValue))
  }
})