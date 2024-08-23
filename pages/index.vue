<template>
  <v-app>
    <div style="height: 100vh;" class="overflow-hidden d-flex flex-column">
      <!-- lang select -->
      <div class="mb-4 bg-grey-lighten-3">
        <Container>
          <v-select
            width="100"
            :items="locales"
            v-model="appLocale"
            density="compact"
            variant="outlined"
            hide-details
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :title="item.title">
                <template v-slot:prepend>
                  <v-list-item-action>
                    <img v-if="item.title == 'en'" width="25" src="https://humresdb.com/languages/imgList/en.svg" />
                    <img v-if="item.title == 'ru'" width="25" src="https://humresdb.com/languages/imgList/ru.svg" />
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
            <template v-slot:selection="{ item, index }">
              <img class="ml-n1" v-if="item.title == 'en'" width="25" src="https://humresdb.com/languages/imgList/en.svg" />
              <img class="ml-n1" v-if="item.title == 'ru'" width="25" src="https://humresdb.com/languages/imgList/ru.svg" />
              <div class="ml-2">{{ item.title }}</div>
            </template>
          </v-select>
        </Container>
      </div>

      <Container class="flex-grow-1">
        <!-- calendar -->
        <div class="h-100 d-flex flex-column w-75">
          <!-- header toolbar -->
          <div class="d-flex justify-space-between mb-6">
            <div>
              <v-btn
                icon="mdi-chevron-left"
                size="small"
                variant="outlined"
                color="#2c3e50"
                @click="calendarMain.getApi().prev()"
              ></v-btn>
              <v-btn
                icon="mdi-chevron-right"
                size="small"
                variant="outlined"
                class="ml-1"
                color="#2c3e50"
                @click="calendarMain.getApi().next()"
                ></v-btn>
              <v-btn
                height="40"
                color="#2c3e50"
                elevation="0"
                class="ml-3"
                slim
                @click="calendarMain.getApi().today()"
              >{{ $t('today') }}</v-btn>
            </div>
            <div id="today-title"></div>
            <div class="d-flex ga-3">
              <v-select
                :items="calendarViewModes"
                v-model="calendarViewMode"
                density="compact"
                variant="outlined"
                hide-details
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :title="$t(item.title)">
                    <template v-slot:prepend>
                      <v-list-item-action>
                        <v-icon v-if="item.title == 'month'" icon="mdi-calendar-month"></v-icon>
                        <v-icon v-if="item.title == 'week'" icon="mdi-calendar-week"></v-icon>
                        <v-icon v-if="item.title == 'day'" icon="mdi-calendar-today"></v-icon>
                        <v-icon v-if="item.title == 'list'" icon="mdi-list-box-outline"></v-icon>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ item, index }">
                  <v-icon v-if="item.title == 'month'" icon="mdi-calendar-month"></v-icon>
                  <v-icon v-if="item.title == 'week'" icon="mdi-calendar-week"></v-icon>
                  <v-icon v-if="item.title == 'day'" icon="mdi-calendar-today"></v-icon>
                  <v-icon v-if="item.title == 'list'" icon="mdi-list-box-outline"></v-icon>
                  <div class="ml-3">{{ $t(item.title) }}</div>
                </template>
              </v-select>
              <v-btn
                height="40"
                color="#2c3e50"
                elevation="0"
                slim
                prepend-icon="mdi-plus"
                @click="addTaskClick"
              >{{ $t('addTask') }}</v-btn>
            </div>
          </div>
          <!-- calendar tasks -->
          <FullCalendar
            ref="calendarMain"
            :options="calendarMainOptions"
            class="w-100"
          >
          </FullCalendar>
        </div>
      </Container>
    </div>

    <!-- task form dialog -->
    <v-dialog v-model="taskFormOpen" @afterLeave="taskForm.reset()" max-width="600">
      <template v-slot:default="{ isActive }">
        <v-card :title="!taskFormEditing ? $t('addTask') : $t('editTask')">
          <v-card-text class="pb-0">
            <v-form ref="taskForm">
              <v-container class="pa-0">
                <v-row>
                  <v-col>
                    <v-text-field
                      autofocus
                      v-model="formValues.title"
                      :rules="rules"
                      :label="$t('title')"
                      required
                      persistent-placeholder
                    />
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="formValues.color"
                      :items="colors"
                      :label="$t('color')"
                      persistent-placeholder
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" :title="$t(item.title)">
                          <template v-slot:prepend>
                            <v-list-item-action>
                              <v-badge inline :color="item.value"></v-badge>
                            </v-list-item-action>
                          </template>
                        </v-list-item>
                      </template>
                      <template v-slot:selection="{ item, index }">
                        <v-badge class="ml-n1 mr-2" inline :color="item.value"></v-badge>
                        {{ $te(item.title) ? $t(item.title) : item.title }}
                      </template>
                      <template v-slot:append-item>
                        <v-divider></v-divider>
                        <v-list-item ref="pickColorBtn" @click="" :title="$t('pickColor')"></v-list-item>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                <v-row v-if="!formValues.allDay">
                  <v-col class="pt-0 d-flex justify-space-between ga-2">
                    <v-text-field
                      width="156"
                      v-model="formValues.start"
                      required
                      :rules="dateRules"
                      :label="$t('start')"
                      :placeholder="getDatePattern(locale)"
                      persistent-placeholder
                    >
                      <v-icon class="order-2" size="x-small" color="black">mdi-calendar-blank</v-icon>
                      <v-menu location="end" v-model="pickerOpen[0]" activator="parent" close-delay="0" :close-on-content-click="false">
                        <v-locale-provider :locale="locale">
                          <v-date-picker
                            v-model="pickerStart"
                            hide-header
                            header=""
                            elevation="5"
                            @update:model-value="formValues.start = pickerStart.toLocaleDateString(locale, {year: 'numeric', month: '2-digit', day: '2-digit'}); pickerOpen[0] = false"
                          ></v-date-picker>
                        </v-locale-provider>
                      </v-menu>
                    </v-text-field>
                    <v-text-field
                      max-width="100"
                      v-model="formValues.startTime"
                      :rules="timeRules"
                      :label="$t('time')"
                      persistent-placeholder
                      type="time"
                    />
                  </v-col>
                  <v-col class="pt-0 d-flex justify-space-between ga-2">
                    <v-text-field
                      width="156"
                      v-model="formValues.end"
                      required
                      :rules="dateRules"
                      :label="$t('end')"
                      :placeholder="getDatePattern(locale)"
                      persistent-placeholder
                    >
                      <v-icon class="order-2" size="x-small" color="black">mdi-calendar-blank</v-icon>
                      <v-menu location="end" v-model="pickerOpen[1]" activator="parent" close-delay="0" :close-on-content-click="false">
                        <v-locale-provider :locale="locale">
                          <v-date-picker
                            v-model="pickerEnd"
                            hide-header
                            header=""
                            elevation="5"
                            @update:model-value="formValues.end = pickerEnd.toLocaleDateString(locale, {year: 'numeric', month: '2-digit', day: '2-digit'}); pickerOpen[1] = false"
                          ></v-date-picker>
                        </v-locale-provider>
                      </v-menu>
                    </v-text-field>
                    <v-text-field
                      max-width="100"
                      v-model="formValues.endTime"
                      :rules="timeRules"
                      :label="$t('time')"
                      persistent-placeholder
                      type="time"
                    />
                  </v-col>
                </v-row>
                <v-row v-if="formValues.allDay">
                  <v-col class="pt-0">
                    <v-text-field
                      width="100%"
                      v-model="formValues.start"
                      required
                      :rules="allDayDateRules"
                      :label="$t('start')"
                      :placeholder="getDatePattern(locale)"
                      persistent-placeholder
                    >
                      <v-icon class="order-2" size="x-small" color="black">mdi-calendar-blank</v-icon>
                      <v-menu activator="parent" close-delay="0">
                        <v-locale-provider :locale="locale">
                          <v-date-picker
                            v-model="pickerStart"
                            height="304"
                            hide-header
                            header=""
                            elevation="5"
                          ></v-date-picker>
                        </v-locale-provider>
                      </v-menu>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <v-checkbox v-model="formValues.allDay" :label="$t('allDay')" hide-details></v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="!taskFormEditing"
              :text="$t('add')"
              @click="addTask(isActive)"
              color="green"
            ></v-btn>
            <v-btn
              v-else
              :text="$t('edit')"
              @click="editTask(isActive)"
              color="green"
            ></v-btn>
            <v-btn
              v-if="!taskFormEditing"
              :text="$t('cancel')"
              @click="closeAddTask(isActive)"
              color="red"
            ></v-btn>
            <v-btn
              v-else
              :text="$t('cancel')"
              @click="closeEditTask(isActive)"
              color="red"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <!-- info dialog -->
    <v-dialog v-model="taskInfoOpen" @afterLeave="currentTask = {}" v-if="!currentTask.hasOwnProperty('title')" max-width="400">
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title>{{ $t('taskInfo') }}</v-card-title>
          <v-card-subtitle v-if="currentTask.allDay">{{ $t('allDay') }}</v-card-subtitle>
          <v-card-text>
            <div class="d-flex align-center ga-2">
              <v-badge class="mx-n1" inline :color="currentTask.backgroundColor"></v-badge>
              <h3 style="font-size: 20px;">{{ currentTask.title }}</h3>
            </div>
            <div v-if="currentTask.allDay" class="mt-2 text-body-2">{{ currentTask.start.toLocaleString(locale, {day: 'numeric', month: 'short', year: 'numeric'}) }}</div>
            <div v-if="(!currentTask.allDay && checkDays(currentTask.start, currentTask.end))" class="mt-2 text-body-2">
              <span>{{ currentTask.start.toLocaleString(locale, {day: 'numeric', month: 'short', year: 'numeric'}) }} • </span>
              <span class="font-weight-bold">{{ currentTask.start.toLocaleString(locale, { hour: 'numeric', minute: 'numeric', hour12: locale == 'en' ? true : false }) }}</span>
              <span> - </span>
              <span class="font-weight-bold">{{ currentTask.end.toLocaleString(locale, { hour: 'numeric', minute: 'numeric', hour12: locale == 'en' ? true : false }) }}</span>
            </div>
            <div v-if="(!currentTask.allDay && !checkDays(currentTask.start, currentTask.end))" class="mt-2 text-body-2">
              <span>{{ currentTask.start.toLocaleString(locale, {day: 'numeric', month: 'short', year: 'numeric'}) }}</span>
              <span class="font-weight-bold">{{ ' ' + currentTask.start.toLocaleString(locale, { hour: 'numeric', minute: 'numeric', hour12: locale == 'en' ? true : false }) }}</span>
              <span> - {{ currentTask.end.toLocaleString(locale, {day: 'numeric', month: 'short', year: 'numeric'}) }}</span>
              <span class="font-weight-bold">{{ ' ' + currentTask.end.toLocaleString(locale, { hour: 'numeric', minute: 'numeric', hour12: locale == 'en' ? true : false }) }}</span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn icon="mdi-pencil" @click="editTaskClick"></v-btn>
            <v-btn icon="mdi-delete" @click="deleteTask(isActive)" color="red"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <!-- color pick dialog -->
    <v-dialog :activator="pickColorBtn" @afterLeave="pickerColor=''" max-width="332">
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-text class="pa-4">
            <v-color-picker v-model="pickerColor" hide-inputs></v-color-picker>
          </v-card-text>
          <v-card-actions>            
            <v-btn
              :text="$t('pick')"
              @click="pickColor(isActive)"
            ></v-btn>
            <v-btn
              :text="$t('close')"
              @click="isActive.value = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-app>
</template>

<script setup>
// change date format
function changeDateFormat(date) {
  if(appLocale.value == 'ru') {
    let date_split = date.split('.')
    let new_date = `${date_split[1]}/${date_split[0]}/${date_split[2]}`
    
    return new_date
  } else {
    return date
  }
}

// locale
const { locale, setLocale } = useI18n()
import { t, getDatePattern } from '@/scripts/locale'

// head
useHead({
  title: 'Task manager',
})

// calendar imports
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import allLocales from '@fullcalendar/core/locales-all'

// calendar
const calendarMain = ref()
const calendarTasks = ref([])
let calendarApi

// locales
const locales = ref(['en', 'ru'])
const appLocale = ref('en') // default locale
watch(appLocale, async (newValue, oldValue) => {
  calendarApi.setOption('locale', newValue)
  setLocale(newValue)
  localStorage.setItem('locale', appLocale.value)
  calendarApi.setOption('firstDay', newValue == 'en' ? 0 : 1)
})

// task id
let taskId;
function createTaskId() {
  taskId++
  localStorage.setItem('id', JSON.stringify(taskId))
  return String(taskId)
}

// mounted
onMounted(() => {
  // get calendar api
  calendarApi = calendarMain.value.getApi()
  
  // get locale
  if(localStorage.getItem('locale')) {
    appLocale.value = localStorage.getItem('locale')
  }
  // set locale
  setLocale(appLocale.value)
  calendarApi.setOption('locale', appLocale.value)

  // get task id
  taskId = JSON.parse(localStorage.getItem('id'))

  // get tasks
  let tasks = JSON.parse(localStorage.getItem('calendarTasks'))

  if(tasks) {
    for(let i = 0; i < tasks.length; i++) {
      calendarApi.addEvent(tasks[i])
    }
  }

  // today title
  document.getElementById('today-title').appendChild(document.querySelector('.fc-toolbar-title'))
  document.querySelector('.fc-header-toolbar').style.display = 'none'

  calendarApi.updateSize()
})

watch(calendarTasks, async (newCalendarTasks, oldCalendarTasks) => {
  localStorage.setItem('calendarTasks', JSON.stringify(newCalendarTasks))
})

// calendar settings
const calendarMainOptions = ref({
  plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin ],
  initialView: 'dayGridMonth',
  events: calendarTasks.value,

  dayMaxEvents: true,
  firstDay: locale.value == 'en' ? 0 : 1,
  fixedWeekCount: false,
  weekNumbers: true,
  snapDuration: '00:15:00',
  
  height: '100%',
  locales: allLocales,
  locale: appLocale.value,

  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
  },

  // editable
  editable: true,
  eventsSet: updateTasks,
  // navs
  navLinks: true,
  navLinkDayClick: function(date, jsEvent) {
    calendarApi.changeView('timeGridDay')
    calendarApi.gotoDate(date)

    calendarViewMode.value = 'timeGridDay'
  },
  navLinkWeekClick: function() {
    calendarViewMode.value = 'timeGridWeek'
  },
  // 
  eventClick: showTaskInfo,
  // select
  selectable: true,
  select: selectClick,
  eventDrop: function(info) {
    if(!info.event.allDay && !info.event.end) {
      calendarApi.getEventById(info.event.id).setEnd(new Date(new Date(info.event.start).getTime()+ 60*60*1000))
    }
  }
})
function updateTasks(events) {
  calendarTasks.value = events
}

// form
const taskForm = ref()
const taskFormOpen = ref(false)
const taskFormEditing = ref(false)

// form values
const formValues = ref({
  title: '',
  start: '',
  startTime: '',
  end: '',
  endTime: '',
  color: '',
  allDay: false,
})
// date pickers
const pickerStart = ref(null)
const pickerEnd = ref(null)
const pickerOpen = ref([false, false])

// formatted task
const task = computed({
  get() {
    return {
      title: formValues.value.title,
      start: new Date(`${changeDateFormat(formValues.value.start)} ${formValues.value.startTime ? formValues.value.startTime : ''}`),
      end: new Date(`${changeDateFormat(formValues.value.end)} ${formValues.value.endTime ? formValues.value.endTime : ''}`),
      color: formValues.value.color,
      allDay: formValues.value.allDay,
    }
  }
})

// form validation
const checkValue = v => !!v || 'required'
const compareStartEnd = () => {
  if(formValues.value.start && formValues.value.end) {
    return ((new Date(changeDateFormat(formValues.value.start)).getTime() <= new Date(changeDateFormat(formValues.value.end)).getTime()) && (formValues.value.start != '' || formValues.value.end != '')) || 'incorrect'
  } else {
    return true
  }
}
const compareStartTimeEndTime = () => {
  if(formValues.value.startTime && !formValues.value.endTime || !formValues.value.startTime && formValues.value.endTime) {
    return 'required'
  }

  if((formValues.value.startTime && formValues.value.endTime && formValues.value.start && formValues.value.end) && (new Date(changeDateFormat(formValues.value.start)).getTime() == new Date(changeDateFormat(formValues.value.end)).getTime())) {
    return (formValues.value.startTime <= formValues.value.endTime && (formValues.value.startTime != '' || formValues.value.endTime != '')) || 'incorrect'
  } else {
    return true
  }
}
const checkValidDay = (v) => {
  let date = changeDateFormat(v)

  return !isNaN(Date.parse(date)) || 'Invalid date'
}

const rules = ref([checkValue])
const dateRules = ref([checkValue, compareStartEnd, checkValidDay])
const allDayDateRules = ref([checkValue, checkValidDay])
const timeRules = ref([compareStartTimeEndTime])
// watchers for validation
watch(() => formValues.value.start, async (newValidationCounter, oldValidationCounter) => {
  if(taskForm.value && !formValues.value.allDay && taskFormOpen.value) {
    taskForm.value.items[2].validate()
    taskForm.value.items[4].validate()
    taskForm.value.items[3].validate()
    taskForm.value.items[5].validate()
  }
})
watch(() => formValues.value.end, async (newValidationCounter, oldValidationCounter) => {
  if(taskForm.value && !formValues.value.allDay && taskFormOpen.value) {
    taskForm.value.items[2].validate()
    taskForm.value.items[4].validate()
    taskForm.value.items[3].validate()
    taskForm.value.items[5].validate()
  }
})
watch(() => formValues.value.startTime, async (newValidationCounter, oldValidationCounter) => {
  if(taskForm.value && !formValues.value.allDay && taskFormOpen.value) {
    taskForm.value.items[3].validate()
    taskForm.value.items[5].validate()
  }
})
watch(() => formValues.value.endTime, async (newValidationCounter, oldValidationCounter) => {
  if(taskForm.value && !formValues.value.allDay && taskFormOpen.value) {
    taskForm.value.items[3].validate()
    taskForm.value.items[5].validate()
  }
})

// color picker
const pickColorBtn = ref()
const colors = ref([
  {
    title: 'red',
    value: '#F44336',
  },
  {
    title: 'green',
    value: '#4CAF50',
  },
  {
    title: 'blue',
    value: '#2196F3',
  },
  {
    title: 'orange',
    value: '#FF9800',
  },
  {
    title: 'purple',
    value: '#9C27B0',
  },
])
const pickerColor = ref('')
function pickColor(isActive) {
  if(pickerColor.value) {
    formValues.value.color = pickerColor.value
  }
  isActive.value = false
}

// add task
function addTaskClick() {
  let date = new Date()
  taskFormEditing.value = false
  taskFormOpen.value = true
  formValues.value.color = colors.value[2].value
  formValues.value.start = date.toLocaleDateString(locale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
  formValues.value.end = date.toLocaleDateString(locale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
}
async function addTask(isActive) {
  const { valid } = await taskForm.value.validate()

  if(valid) {
    if(!formValues.value.allDay && !formValues.value.endTime && checkDays(changeDateFormat(formValues.value.start), changeDateFormat(formValues.value.end))) {
      formValues.value.endTime = '01:00'
    }

    let newTask = task.value
    newTask.id = createTaskId()

    calendarApi.addEvent(newTask)
    closeAddTask(isActive)
  }
}
function selectClick(selectInfo) { 
  calendarApi.unselect()
  taskFormEditing.value = false

  formValues.value.color = colors.value[2].value
  formValues.value.start = new Date(selectInfo.start).toLocaleDateString(locale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
  formValues.value.startTime = new Date(selectInfo.start).toLocaleString('ru', {hour: '2-digit', minute: '2-digit'})
  formValues.value.end = new Date(selectInfo.end.getTime()-1*24*60*60*1000).toLocaleDateString(locale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
  formValues.value.endTime = ''
  formValues.value.allDay = selectInfo.allDay

  if(!selectInfo.allDay && calendarViewMode.value !== 'dayGridMonth'){
    formValues.value.end = new Date(selectInfo.end).toLocaleDateString(locale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
    formValues.value.endTime = new Date(selectInfo.end).toLocaleString('ru', {hour: '2-digit', minute: '2-digit'})
  }
  if(calendarViewMode.value == 'dayGridMonth') {
    formValues.value.allDay = false
    formValues.value.startTime = ''

    if(selectInfo.start.getTime() != selectInfo.end.getTime()-1*24*60*60*1000) {
      formValues.value.end = new Date(selectInfo.end.getTime()-1*24*60*60*1000).toLocaleDateString(locale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
    }
  }

  taskFormOpen.value = true
}
function closeAddTask(isActive) {
  taskForm.value.reset()
  isActive.value = false
}

// task info
const taskInfoOpen = ref(false)
const currentTask = ref({})

function showTaskInfo(eventClickInfo) {
  currentTask.value = eventClickInfo.event
  taskInfoOpen.value = true
}
function checkDays(day1, day2) {
  return new Date(new Date(day1).toLocaleDateString('en')).getTime() == new Date(new Date(day2).toLocaleDateString('en')).getTime()
}

function deleteTask(isActive) {
  calendarApi.getEventById(currentTask.value.id).remove()
  isActive.value = false
}
function editTaskClick() {
  taskFormEditing.value = true

  formValues.value.title = currentTask.value.title
  formValues.value.color = currentTask.value.backgroundColor
  formValues.value.allDay = currentTask.value.allDay
  formValues.value.start = currentTask.value.start.toLocaleDateString(locale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})

  if(!currentTask.value.allDay) {
    formValues.value.startTime = currentTask.value.start.toLocaleString('ru', {hour: '2-digit', minute: '2-digit'})

    formValues.value.end = currentTask.value.end.toLocaleDateString(locale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
    formValues.value.endTime = currentTask.value.end.toLocaleString('ru', {hour: '2-digit', minute: '2-digit'})
  }
  taskFormOpen.value = true
}

// edit task
async function editTask(isActive) {
  const { valid } = await taskForm.value.validate()

  if(valid) {
    calendarApi.getEventById(currentTask.value.id).setProp('title', task.value.title)
    calendarApi.getEventById(currentTask.value.id).setProp('color', task.value.color)
    calendarApi.getEventById(currentTask.value.id).setAllDay(task.value.allDay)

    if(formValues.value.allDay) {
      calendarApi.getEventById(currentTask.value.id).setStart(task.value.start, { maintainDuration: true })
    } else {
      if(!formValues.value.endTime && checkDays(changeDateFormat(formValues.value.start), changeDateFormat(formValues.value.end))) {
        formValues.value.endTime = '01:00'
      }

      calendarApi.getEventById(currentTask.value.id).setStart(task.value.start)
      calendarApi.getEventById(currentTask.value.id).setEnd(task.value.end)
    }
    
    taskInfoOpen.value = false
    closeEditTask(isActive)
  }
}
function closeEditTask(isActive) {
  taskForm.value.reset()
  isActive.value = false
}

// view mode
const calendarViewModes = ref([
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
  {
    title: 'list',
    value: 'listMonth'
  },
])
const calendarViewMode = ref('dayGridMonth')
watch(calendarViewMode, async (newValue, oldValue) => {
  calendarApi.changeView(newValue)
})
</script>