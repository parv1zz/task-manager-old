import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import allLocales from '@fullcalendar/core/locales-all'
import { appLocale } from './locale'
import { taskInfoOpen, infoTask } from './info'
import { taskFormOpen, taskFormEditing, formValues, isEditingFromForm, taskFormEdited } from './form'
import { colors } from './settings'
import { refreshNotifications } from './notification'

export let calendarApi

const taskId = ref(0)
function createTaskId() {
  taskId.value++
  localStorage.setItem('id', JSON.stringify(taskId.value))
  return String(taskId.value)
}
function getTaskId() {
  taskId.value = Number.parseInt(JSON.parse(localStorage.getItem('id')))
}

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

// options
export const calendarOptions = {
  plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
  initialView: 'dayGridMonth',
  events: calendarTasks.value,

  // date settings
  nowIndicator: true,
  dayMaxEvents: true,
  firstDay: appLocale.value == 'en' ? 0 : 1,
  weekText: appLocale.value == 'en' ? 'W' : 'H',
  snapDuration: '00:15:00',
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
  // drop issue
  eventDrop: function(info) {
    if(!info.event.allDay && !info.event.end) {
      calendarApi.getEventById(info.event.id).setEnd(new Date(new Date(info.event.start).getTime()+ 60*60*1000))
    }
  },
  // event change
  eventResizableFromStart: true,
  eventChange: updateReminder,
}

// calendar funcs
function updateTasks(events) {
  calendarTasks.value = events
}

function updateReminder(info) {
  const startChanged = info.event.start.getTime() != info.oldEvent.start.getTime()

  const reminders = info.event.extendedProps.reminders

  if(reminders.length > 0 && startChanged && !isEditingFromForm.value) {
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
            body: `${info.event.start} - ${info.event.end}`,
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
  }
}

function showTaskInfo(info) {
  infoTask.value = info.event
  taskInfoOpen.value = true
}

function selectTask(info) {
  taskFormEditing.value = false

  formValues.value.color = colors[2].value
  formValues.value.start = new Date(info.start).toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
  formValues.value.startTime = new Date(info.start).toLocaleString('ru', {hour: '2-digit', minute: '2-digit'})
  formValues.value.end = new Date(info.end.getTime()-1*24*60*60*1000).toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
  formValues.value.endTime = ''
  formValues.value.allDay = info.allDay

  if(!info.allDay && calendarApi.view.type !== 'dayGridMonth'){
    formValues.value.end = new Date(info.end).toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
    formValues.value.endTime = new Date(info.end).toLocaleString('ru', {hour: '2-digit', minute: '2-digit'})
  }
  if(info.allDay) {
    formValues.value.startTime = ''
  }
  if(calendarApi.view.type == 'dayGridMonth') {
    formValues.value.allDay = false
    formValues.value.startTime = ''

    if(info.start.getTime() != info.end.getTime()-1*24*60*60*1000) {
      formValues.value.end = new Date(info.end.getTime()-1*24*60*60*1000).toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
    }
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


const objectsEqual = (o1, o2) => {
  return typeof o1 === 'object' && Object.keys(o1).length > 0 
      ? Object.keys(o1).length === Object.keys(o2).length 
          && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
      : o1 === o2;
}

const arraysEqual = (a1, a2) => a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

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
  
  if(task.allDay) {
    if(infoTask.value.start.getTime() != task.start.getTime()) {
      calendarEvent.setStart(task.start, { maintainDuration: true })
      taskFormEdited.value = true
    }
  } else {
    if(infoTask.value.start.getTime() != task.start.getTime()) {
      calendarEvent.setStart(task.start)
      taskFormEdited.value = true
    }
    if(infoTask.value.end) {
      if(infoTask.value.end.getTime() != task.end.getTime()) {
        calendarEvent.setEnd(task.end)
        taskFormEdited.value = true
      }
    } else {
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