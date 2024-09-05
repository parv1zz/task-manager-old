import { formValues } from "./form"
import { changeDateFormat } from "./dates"

export const checkValue = v => !!v || 'required'
// dates
export const compareStartEnd = () => {
  if(formValues.value.start && formValues.value.end) {
    return (
      (new Date(changeDateFormat(formValues.value.start)).getTime() <= new Date(changeDateFormat(formValues.value.end)).getTime())
      &&
      (formValues.value.start != '' || formValues.value.end != '')
    ) || 'incorrect'
  } else {
    return true
  }
}
// times
export const compareStartTimeEndTime = () => {
  if(
    (formValues.value.startTime && formValues.value.endTime && formValues.value.start && formValues.value.end)
    &&
    (new Date(changeDateFormat(formValues.value.start)).getTime() == new Date(changeDateFormat(formValues.value.end)).getTime())
  ) {
    return (
      (new Date(`1/1/1 ${formValues.value.startTime}`).toLocaleString('ru', { hour: '2-digit', minute: '2-digit' }) <= new Date(`1/1/1 ${formValues.value.endTime}`).toLocaleString('ru', { hour: '2-digit', minute: '2-digit' }))
      &&
      (formValues.value.startTime != '' || formValues.value.endTime != '')
    ) || 'incorrect'
  } else {
    return true
  }
}
export const checkStartTimeValue = () => {
  if(!formValues.value.startTime && formValues.value.endTime) {
    return 'required'
  } else {
    return true
  }
}
export const checkEndTimeValue = () => {
  if(formValues.value.startTime && !formValues.value.endTime) {
    return 'required'
  } else {
    return true
  }
}
// check valid  
export const checkValidDay = v => {
  let date = changeDateFormat(v)

  return !isNaN(Date.parse(date)) || 'Invalid date'
}
export const checkValidTime = v => {
  if(v) {
    let time = new Date(`1/1/1 ${v}`)
    return !isNaN(Date.parse(time)) || 'Invalid time'
  }
  return true
}

export const rules = [checkValue]
export const dateRules = [checkValue, checkValidDay, compareStartEnd]
export const timeRules = [checkValidTime, compareStartTimeEndTime]
export const allDayDateRules = [checkValue, checkValidDay]