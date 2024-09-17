import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import allLocales from '@fullcalendar/core/locales-all'
import { appLocale } from './locale'
import { taskInfoOpen, infoTask } from './info'
import { taskFormOpen, taskFormEditing, formValues, isEditingFromForm, taskFormEdited } from './form'
import { colors } from './settings'
import { refreshNotifications } from './notification'
import { checkDays } from './dates'
import { snackbars, snackbarTimeout } from './snackbars'
import { arraysEqual } from './reminders'

// api
export let calendarApi

// id
const taskId = ref(0)
function createTaskId() {
  taskId.value++
  localStorage.setItem('id', JSON.stringify(taskId.value))
  return String(taskId.value)
}
function getTaskId() {
  const id = JSON.parse(localStorage.getItem('id'))
  if(id) taskId.value = Number.parseInt(id)
}

// tasks
export const calendarTasks = ref([])
watch(calendarTasks, async (n, o) => {
  localStorage.setItem('calendarTasks', JSON.stringify(n))
})
function getTasks() {
  let tasks = JSON.parse(localStorage.getItem('calendarTasks'))
  if(tasks) {
    for(let i = 0; i < tasks.length; i++) {
      calendarApi.addEvent(tasks[i])
    }
  }
}

// check dones on mount
function checkDones() {
  const events = calendarApi.getEvents()

  for(const event of events) {
    if(event.extendedProps.reminders) {
      for(const reminder of event.extendedProps.reminders) {
        let timeOld = (event.start.getTime() - reminder.value) < new Date().getTime()
        if(timeOld) {
          reminder.done = true
        }
      }
    }
  }
}

// calendar init
export function initCalendar(api) {
  calendarApi = api
  getTaskId()
  getTasks()
  checkDones()

  // title
  document.getElementById('today-title').appendChild(document.querySelector('.fc-toolbar-title'))
  document.querySelector('.fc-toolbar').style.display = 'none'

  // size & view
  calendarApi.updateSize()
  calendarApi.changeView(calendarViewMode.value)
}

//* ////////////////////////////////////////////////////////////////////////////////////////////////////////
// options
export const calendarOptions = {
  plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
  initialView: 'dayGridMonth',
  events: calendarTasks.value,
  timeZone: 'local',

  // date settings
  forceEventDuration: true,
  nowIndicator: true,
  dayMaxEvents: true,
  firstDay: appLocale.value == 'en' ? 0 : 1,
  weekText: appLocale.value == 'en' ? 'W' : 'H',
  snapDuration: '00:15:00',
  scrollTime: '00:00:00',
  fixedWeekCount: false,
  weekNumbers: true,
  views: {
    week: {
      dayHeaderFormat: { weekday: 'short', day: 'numeric' },
    }
  },
  // sizing
  height: '100%',
  // locale
  locales: allLocales,
  locale: appLocale.value,
  // mobile
  longPressDelay: 500,
  eventLongPressDelay: 500,
  selectLongPressDelay: 500,
  // header
  headerToolbar: {
    start: '',
    center: 'title',
    end: '',
  },
  // editable
  editable: true,
  eventsSet: updateTasks,
  // navs
  navLinks: true,
  navLinkDayClick: function(date, jsEvent) {
    calendarViewMode.value = 'timeGridDay'
    calendarApi.gotoDate(date)
  },
  navLinkWeekClick: function(date) {
    calendarViewMode.value = 'timeGridWeek'
    calendarApi.gotoDate(date)
  },
  // event click
  eventClick: showTaskInfo,
  // day click
  selectable: true,
  unselectAuto: false,
  select: selectTask,
  // event change
  eventResizableFromStart: true,
  eventChange: updateReminder,
}
//* ////////////////////////////////////////////////////////////////////////////////////////////////////////

// calendar funcs
function updateTasks(events) {
  calendarTasks.value = events
}

// update reminders on start change
function updateReminder(info) {
  // snackbar
  snackbars.value[1].open = false
  snackbars.value[1].open = true
  snackbars.value[1].title = info.event.title
  snackbars.value[1].text = 'saved'

  // reminders
  const startChanged = info.event.start.getTime() != info.oldEvent.start.getTime()
  const endChanged = info.event.end.getTime() != info.oldEvent.end.getTime()
  
  const reminders = info.event.extendedProps.reminders
  
  if(reminders.length > 0 && !isEditingFromForm.value && (startChanged || endChanged)) {
    const notifications = []

    for(const reminder of reminders) {
      // done
      let time = new Date(info.event.start.getTime() - reminder.value)
      let isFuture = time.getTime() >= Date.now()
      reminder.done = !isFuture

      // resend
      if(isFuture) {
        notifications.push({
          notification: {
            title: info.event.title,
            body: notificationBody(info.event),
          },
          time: time,
          ids: {
            taskId: Number.parseInt(info.event.id),
            reminderId: reminder.id,
          }
        })
      }
    }

    refreshNotifications(info.event.id, notifications)

    if(startChanged) {
      // snackbar
      setTimeout(() => {
        snackbars.value[4].open = false
        snackbars.value[4].open = true
        snackbars.value[4].title = info.event.title
      }, snackbarTimeout.value)
    }
  }
}

// task click
function showTaskInfo(info) {
  // allday decrease end by 1
  let event = {
    id: info.event.id,
    allDay: info.event.allDay,
    title: info.event.title,
    backgroundColor: info.event.backgroundColor,
    start: info.event.start,
    end: info.event.end,
    extendedProps: info.event.extendedProps,
  }
  // allday issue 
  if(info.event.allDay) {
    event.end = new Date(info.event.end.getTime()-1*24*3600*1000)
  }

  infoTask.value = event
  taskInfoOpen.value = true
}

// select task
function selectTask(info) {
  taskFormEditing.value = false

  formValues.value.color = colors[2].value
  formValues.value.start = new Date(info.start).toLocaleDateString(appLocale.value, {year: 'numeric', month: 'numeric', day: 'numeric'})
  formValues.value.end = new Date(info.end.getTime()-1).toLocaleDateString(appLocale.value, {year: 'numeric', month: 'numeric', day: 'numeric'})
  formValues.value.allDay = info.allDay

  if(!info.allDay && calendarApi.view.type !== 'dayGridMonth'){
    formValues.value.end = new Date(info.end).toLocaleDateString(appLocale.value, {year: 'numeric', month: 'numeric', day: 'numeric'})
    formValues.value.startTime = new Date(info.start).toLocaleString(appLocale.value, {hour: 'numeric', minute: 'numeric'})
    formValues.value.endTime = new Date(info.end).toLocaleString(appLocale.value, {hour: 'numeric', minute: 'numeric'})
  }

  taskFormOpen.value = true
}

// view mode
export const calendarViewModes = [
  {
    title: 'month',
    value: 'dayGridMonth'
  },
  {
    title: 'week',
    value: 'timeGridWeek'
  },
  {
    title: 'day',
    value: 'timeGridDay'
  },
]
export const calendarViewMode = ref('dayGridMonth')
watch(calendarViewMode, async (n, o) => {
  calendarApi.changeView(n)
})

// funcs
export function addTask(task, reminders) {
  let newTask = task
  newTask.id = createTaskId()
  newTask.reminders = reminders
  // newTask.display = 'block'

  calendarApi.addEvent(newTask)

  return Number.parseInt(newTask.id)
}

export function editTask(task, reminders) {
  let calendarEvent = calendarApi.getEventById(infoTask.value.id)
  if(infoTask.value.title != task.title) {
    calendarEvent.setProp('title', task.title)
    taskFormEdited.value = true
  }
  if(infoTask.value.backgroundColor != task.color) calendarEvent.setProp('color', task.color)
  if(infoTask.value.allDay != task.allDay) {
    calendarEvent.setAllDay(task.allDay)
    taskFormEdited.value = true
  }
  
  if(infoTask.value.start.getTime() != task.start.getTime()) {
    calendarEvent.setStart(task.start)
    taskFormEdited.value = true
  }
  // allday issue
  if(task.allDay) {
    if(infoTask.value.end.getTime()+1*24*3600*1000 != task.end.getTime()) {
      calendarEvent.setEnd(task.end)
      taskFormEdited.value = true
    }
  } else {
    if(infoTask.value.end.getTime() != task.end.getTime()) {
      calendarEvent.setEnd(task.end)
      taskFormEdited.value = true
    }
  }
  if(!arraysEqual(infoTask.value.extendedProps.reminders, reminders)) {
    calendarEvent.setExtendedProp('reminders', reminders)
    taskFormEdited.value = true
  }
}

export function deleteTask(task) {
  calendarApi.getEventById(task.id).remove()
}

export function reminderDone(taskId, reminderId) {
  let reminders = calendarApi.getEventById(Number.parseInt(taskId)).extendedProps.reminders
  reminders.find(v => v.id == Number.parseInt(reminderId)).done = true
  calendarApi.getEventById(Number.parseInt(taskId)).setExtendedProp('reminders', reminders)
}

export function notificationBody(task) {
  let body
  let end = new Date(task.end.getTime() - 1*24*3600*1000)
  // all day
  if(task.allDay) {
    body = `${task.start.toLocaleString(appLocale.value, { year: 'numeric', month: 'numeric', day: 'numeric' })} - ${end.toLocaleString(appLocale.value, { year: 'numeric', month: 'numeric', day: 'numeric' })}`
  } else {
    if(checkDays(task.start, task.end)) { // one day
      body = `${task.start.toLocaleString(appLocale.value, { year: 'numeric', month: 'numeric', day: 'numeric' })}, ${task.start.toLocaleString(appLocale.value, { hour: 'numeric', minute: 'numeric', hour12: appLocale.value == 'en' })} - ${task.end.toLocaleString(appLocale.value, { hour: 'numeric', minute: 'numeric', hour12: appLocale.value == 'en' })}`
    } else { // many days
      body = `${task.start.toLocaleString(appLocale.value, { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: appLocale.value == 'en' })} - ${task.end.toLocaleString(appLocale.value, { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: appLocale.value == 'en' })}`
    }
  }
  return body
}