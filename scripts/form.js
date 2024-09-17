import { changeDateFormat } from "./dates"

export const taskFormOpen = ref(false)
export const taskFormEditing = ref(false)
export const isEditingFromForm = ref(false)
export const taskFormEdited = ref(false) 

export const formValues = ref({
  allDay: false,
  title: '',
  color: '',
  start: '',
  startTime: '',
  end: '',
  endTime: '',
  filterValue: '',
})

export const formattedTask = computed({
  get() {
    return {
      title: formValues.value.title,
      start: new Date(`${changeDateFormat(formValues.value.start)} ${(formValues.value.startTime && !formValues.value.allDay) ? formValues.value.startTime : ''}`),
      end: new Date(`${changeDateFormat(formValues.value.end)} ${(formValues.value.endTime && !formValues.value.allDay) ? formValues.value.endTime : ''}`),
      color: formValues.value.color,
      allDay: formValues.value.allDay,
    }
  }
})


export const repeats = ['No repeat', 'Daily', 'Weekly', 'Annualy',]
export const repeat = ref(repeats[0])

export const reminderId = ref(0)
export const reminders = ref([])