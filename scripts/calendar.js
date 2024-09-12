import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import allLocales from '@fullcalendar/core/locales-all'
import { appLocale } from './locale'
import { taskInfoOpen, infoTask } from './info'
import { taskFormOpen, taskFormEditing, formValues } from './form'
import { colors } from './settings'

export let calendarApi

const taskId = ref()
function createTaskId() {
  taskId.value++
  localStorage.setItem('id', JSON.stringify(taskId.value))
  return String(taskId.value)
}
function getTaskId() {
  taskId.value = JSON.parse(localStorage.getItem('id'))
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

function checkDones() {
  for(const event of calendarApi.getEvents()) {
    for(const reminder of event.extendedProps.reminders) {
      let timeOld = (event.start.getTime() - reminder.value) <= new Date().getTime()
      if(timeOld) {
        reminder.done = true
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
  longPressDelay: 250,
  eventLongPressDelay: 250,
  selectLongPressDelay: 250,
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
}

// calendar funcs
function updateTasks(events) {
  calendarTasks.value = events
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

export function editTask(id, task) {
  let calendarEvent = calendarApi.getEventById(id)
  calendarEvent.setProp('title', task.title)
  calendarEvent.setProp('color', task.color)
  calendarEvent.setAllDay(task.allDay)

  if(task.allDay) {
    calendarEvent.setStart(task.start, { maintainDuration: true })
  } else {
    calendarEvent.setStart(task.start)
    calendarEvent.setEnd(task.end)
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