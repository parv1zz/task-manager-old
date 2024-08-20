<template>
  <v-app>
    <div style="height: 100vh;" class="overflow-hidden d-flex flex-column">
      <!-- lang select -->
      <div class="mb-6 bg-grey-lighten-3">
        <Container class="pa-2">
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
        <div class="h-100 d-flex flex-column pa-2">
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
                      v-model="formTask.title"
                      :rules="rules"
                      :label="$t('title')"
                      required
                      persistent-placeholder
                    />
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="formTask.color"
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
                <v-row v-if="!formTask.allDay">
                  <v-col class="pt-0 d-flex justify-space-between ga-2">
                    <v-text-field
                      max-width="160"
                      v-model="formTask.start"
                      required
                      :rules="dateRules"
                      :label="$t('start')"
                      persistent-placeholder
                      type="date"
                    />
                    <v-text-field
                      max-width="100"
                      v-model="formTask.startTime"
                      :rules="timeRules"
                      :label="$t('time')"
                      persistent-placeholder
                      type="time"
                    />
                  </v-col>
                  <v-col class="pt-0 d-flex justify-space-between ga-2">
                    <v-text-field
                      max-width="160"
                      v-model="formTask.end"
                      required
                      :rules="dateRules"
                      :label="$t('end')"
                      persistent-placeholder
                      type="date"
                    />
                    <v-text-field
                      max-width="100"
                      v-model="formTask.endTime"
                      :rules="timeRules"
                      :label="$t('time')"
                      persistent-placeholder
                      type="time"
                    />
                  </v-col>
                </v-row>
                <v-row v-if="formTask.allDay">
                  <v-col class="pt-0">
                    <v-text-field
                      v-model="formTask.start"
                      required
                      :rules="rules"
                      :label="$t('date')"
                      persistent-placeholder
                      type="date"
                    />
                  </v-col>
                </v-row>
              </v-container>
              <v-checkbox v-model="formTask.allDay" :label="$t('allDay')" hide-details></v-checkbox>
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
            <div v-if="currentTask.allDay" class="mt-2 text-body-2">{{ `${currentTask.start.getDate()} ${new Intl.DateTimeFormat(locale, { month: 'short' }).format(currentTask.start)} ${currentTask.start.getFullYear()}` }}</div>
            <div v-if="(!currentTask.allDay && checkDays(currentTask.start, currentTask.end))" class="mt-2 text-body-2">
              <span>{{ `${currentTask.start.getDate()} ${new Intl.DateTimeFormat(locale, { month: 'short' }).format(currentTask.start)} ${currentTask.start.getFullYear()} • ` }}</span>
              <span class="font-weight-bold">{{ `${currentTask.start.getHours()}:${currentTask.start.getMinutes() < 10 ? '0'+currentTask.start.getMinutes() : currentTask.start.getMinutes()}` }}</span>
              <span> - </span>
              <span class="font-weight-bold">{{ `${currentTask.end.getHours()}:${currentTask.end.getMinutes() < 10 ? '0'+currentTask.end.getMinutes() : currentTask.end.getMinutes()}` }}</span>
            </div>
            <div v-if="(!currentTask.allDay && !checkDays(currentTask.start, currentTask.end))" class="mt-2 text-body-2">
              <span>{{ `${currentTask.start.getDate()} ${new Intl.DateTimeFormat(locale, { month: 'short' }).format(currentTask.start)} ${currentTask.start.getFullYear()}` }}</span>
              <span class="font-weight-bold">{{ ` ${currentTask.start.getHours()}:${currentTask.start.getMinutes() < 10 ? '0'+currentTask.start.getMinutes() : currentTask.start.getMinutes()}` }}</span>
              <span>{{ ` - ${currentTask.end.getDate()} ${new Intl.DateTimeFormat(locale, { month: 'short' }).format(currentTask.end)} ${currentTask.end.getFullYear()}` }}</span>
              <span class="font-weight-bold">{{ ` ${currentTask.end.getHours()}:${currentTask.end.getMinutes() < 10 ? '0'+currentTask.end.getMinutes() : currentTask.end.getMinutes()}` }}</span>
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
import container from '~/components/container.vue'

// locale
const { locale, setLocale } = useI18n()
import { t } from '@/scripts/locale'

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

// locales
const locales = ref(['en', 'ru'])
const appLocale = ref('en') // default locale
watch(appLocale, async (newValue, oldValue) => {
  calendarMain.value.getApi().setOption('locale', newValue)
  setLocale(newValue)
  localStorage.setItem('locale', appLocale.value)
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
  // get locale
  if(localStorage.getItem('locale')) {
    appLocale.value = localStorage.getItem('locale')
  }
  // set locale
  setLocale(appLocale.value)
  calendarMain.value.getApi().setOption('locale', appLocale.value)

  // get task id
  taskId = JSON.parse(localStorage.getItem('id'))

  // get tasks
  let tasks = JSON.parse(localStorage.getItem('calendarTasks'))

  if(tasks) {
    for(let i = 0; i < tasks.length; i++) {
      calendarMain.value.getApi().addEvent(tasks[i])
    }
  }

  // today title
  document.getElementById('today-title').appendChild(document.querySelector('.fc-toolbar-title'))
  document.querySelector('.fc-header-toolbar').style.display = 'none'

  calendarMain.value.getApi().updateSize()
})

watch(calendarTasks, async (newCalendarTasks, oldCalendarTasks) => {
  localStorage.setItem('calendarTasks', JSON.stringify(newCalendarTasks))
})

// calendar settings
const calendarMainOptions = ref({
  plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin ],
  initialView: 'dayGridMonth',
  events: calendarTasks.value,
  firstDay: 1,
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
  // 
  dayMaxEvents: true,
  // navs
  navLinks: true,
  navLinkDayClick: function(date, jsEvent) {
    let api = calendarMain.value.getApi()
    api.changeView('timeGridDay')
    api.gotoDate(date)

    calendarViewMode.value = 'timeGridDay'
  },
  navLinkWeekClick: function() {
    calendarViewMode.value = 'timeGridWeek'
  },
  // 
  eventClick: showTaskInfo,
  // select
  selectable: true,
  select: selectClick
})
function updateTasks(events) {
  calendarTasks.value = events
}

// form
const taskForm = ref()
const taskFormOpen = ref(false)
const taskFormEditing = ref(false)

// form values
const formTask = ref({
  title: ref(''),
  start: ref(''),
  startTime: ref(''),
  end: ref(''),
  endTime: ref(''),
  color: ref(''),
  allDay: ref(false),
})

// form validation
const checkValue = v => !!v || 'required'
const compareStartEnd = () => {
  if(formTask.value.start && formTask.value.end) {
    return ((new Date(formTask.value.start).getTime() <= new Date(formTask.value.end).getTime()) && (formTask.value.start != '' || formTask.value.end != '')) || 'incorrect'
  } else {
    return true
  }
}
const compareStartTimeEndTime = () => {
  if((formTask.value.startTime && formTask.value.endTime && formTask.value.start && formTask.value.end) && (new Date(formTask.value.start).getTime() == new Date(formTask.value.end).getTime())) {
    return (formTask.value.startTime <= formTask.value.endTime && (formTask.value.startTime != '' || formTask.value.endTime != '')) || 'incorrect'
  } else {
    return true
  }
}
const rules = ref([checkValue])
const dateRules = ref([checkValue , compareStartEnd])
const timeRules = ref([compareStartTimeEndTime])
// watchers for validation
watch(() => formTask.value.start, async (newValidationCounter, oldValidationCounter) => {
  if(taskForm.value && !formTask.value.allDay && taskFormOpen.value) {
    taskForm.value.items[2].validate()
    taskForm.value.items[4].validate()
    taskForm.value.items[3].validate()
    taskForm.value.items[5].validate()
  }
})
watch(() => formTask.value.end, async (newValidationCounter, oldValidationCounter) => {
  if(taskForm.value && !formTask.value.allDay && taskFormOpen.value) {
    taskForm.value.items[2].validate()
    taskForm.value.items[4].validate()
    taskForm.value.items[3].validate()
    taskForm.value.items[5].validate()
  }
})
watch(() => formTask.value.startTime, async (newValidationCounter, oldValidationCounter) => {
  if(taskForm.value && !formTask.value.allDay && taskFormOpen.value) {
    taskForm.value.items[3].validate()
    taskForm.value.items[5].validate()
  }
})
watch(() => formTask.value.endTime, async (newValidationCounter, oldValidationCounter) => {
  if(taskForm.value && !formTask.value.allDay && taskFormOpen.value) {
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
    formTask.value.color = pickerColor.value
  }
  isActive.value = false
}

// add task
function addTaskClick() {
  taskFormEditing.value = false
  taskFormOpen.value = true
  formTask.value.color = colors.value[2].value
  formTask.value.start = new Date().getFullYear() + '-' + (new Date().getMonth()+1 < 10 ? `0${new Date().getMonth()+1}` : new Date().getMonth()+1) + '-' + (new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate())
  formTask.value.startTime = '00:00'
}
async function addTask(isActive) {
  const { valid } = await taskForm.value.validate()

  if(valid) {
    let taskStart = ''
    let taskEnd = ''
    if(formTask.value.startTime) {
      taskStart = formTask.value.start + ' ' + formTask.value.startTime
    } else {
      taskStart = formTask.value.start + ' 00:00'
    }
    if(formTask.value.endTime) {
      taskEnd = formTask.value.end + ' ' + formTask.value.endTime
    } else {
      if(formTask.value.start == formTask.value.end) {
        taskEnd = formTask.value.end + ' 01:00'
      } else {
        taskEnd = formTask.value.end + ' 00:00'
      }
    }
    if(formTask.value.startTime && !formTask.value.endTime) {
      taskEnd = formTask.value.end + ' ' + String(Number.parseInt(formTask.value.startTime.split(':')[0]) + 1) + ':' + formTask.value.startTime.split(':')[1]
    }

    let newTask =  {
      id: createTaskId(),
      title: formTask.value.title,
      start: new Date(taskStart).getTime(),
      end: new Date(taskEnd).getTime(),
      color: formTask.value.color,
      allDay: formTask.value.allDay,
    }

    calendarMain.value.getApi().addEvent(newTask)
    closeAddTask(isActive)
  }
}
function selectClick(selectInfo) {  
  taskFormEditing.value = false
  taskFormOpen.value = true
  formTask.value.color = colors.value[2].value
  formTask.value.start = selectInfo.start.getFullYear() + '-' + (selectInfo.start.getMonth()+1 < 10 ? `0${selectInfo.start.getMonth()+1}` : selectInfo.start.getMonth()+1) + '-' + (selectInfo.start.getDate() < 10 ? `0${selectInfo.start.getDate()}` : selectInfo.start.getDate())
  formTask.value.startTime = (selectInfo.start.getHours() < 10 ? `0${selectInfo.start.getHours()}` : selectInfo.start.getHours()) + ':' + (selectInfo.start.getMinutes() < 10 ? `0${selectInfo.start.getMinutes()}` : selectInfo.start.getMinutes())
  
  if(selectInfo.allDay){
    formTask.value.allDay = selectInfo.allDay
  } else {
    formTask.value.allDay = selectInfo.allDay
    if(calendarViewMode.value !== 'dayGridMonth') {
      formTask.value.end = selectInfo.end.getFullYear() + '-' + (selectInfo.end.getMonth()+1 < 10 ? `0${selectInfo.end.getMonth()+1}` : selectInfo.end.getMonth()+1) + '-' + (selectInfo.end.getDate() < 10 ? `0${selectInfo.end.getDate()}` : selectInfo.end.getDate())
      formTask.value.endTime = (selectInfo.end.getHours() < 10 ? `0${selectInfo.end.getHours()}` : selectInfo.end.getHours()) + ':' + (selectInfo.end.getMinutes() < 10 ? `0${selectInfo.end.getMinutes()}` : selectInfo.end.getMinutes())
    }
  }
  if(calendarViewMode.value == 'dayGridMonth') {
    formTask.value.allDay = false
  }

  calendarMain.value.getApi().unselect()
}
function closeAddTask(isActive) {
  taskForm.value.reset()
  isActive.value = false
}

// task info
const taskInfoOpen = ref(false)
const currentTask = ref({})

function showTaskInfo(eventClickInfo) {
  taskInfoOpen.value = true
  currentTask.value = eventClickInfo.event
}
function checkDays(day1, day2) {
  return new Date(`${new Date(day1).getFullYear()} ${new Date(day1).getMonth()+1} ${new Date(day1).getDate()}`).getTime() == new Date(`${new Date(day2).getFullYear()} ${new Date(day2).getMonth()+1} ${new Date(day2).getDate()}`).getTime()
}
function deleteTask(isActive) {
  calendarMain.value.getApi().getEventById(currentTask.value.id).remove()
  isActive.value = false
}
function editTaskClick() {
  taskFormEditing.value = true

  formTask.value.title = currentTask.value.title
  formTask.value.color = currentTask.value.backgroundColor
  formTask.value.allDay = currentTask.value.allDay

  if(currentTask.value.allDay) {
    formTask.value.start = currentTask.value.start.getFullYear() + '-' + (currentTask.value.start.getMonth()+1 < 10 ? `0${currentTask.value.start.getMonth()+1}` : currentTask.value.start.getMonth()+1) + '-' + (currentTask.value.start.getDate() < 10 ? `0${currentTask.value.start.getDate()}` : currentTask.value.start.getDate())
  } else {
    formTask.value.start = currentTask.value.start.getFullYear() + '-' + (currentTask.value.start.getMonth()+1 < 10 ? `0${currentTask.value.start.getMonth()+1}` : currentTask.value.start.getMonth()+1) + '-' + (currentTask.value.start.getDate() < 10 ? `0${currentTask.value.start.getDate()}` : currentTask.value.start.getDate())
    formTask.value.startTime = (currentTask.value.start.getHours() < 10 ? `0${currentTask.value.start.getHours()}` : currentTask.value.start.getHours()) + ':' + (currentTask.value.start.getMinutes() < 10 ? `0${currentTask.value.start.getMinutes()}` : currentTask.value.start.getMinutes())

    formTask.value.end = currentTask.value.end.getFullYear() + '-' + (currentTask.value.end.getMonth()+1 < 10 ? `0${currentTask.value.end.getMonth()+1}` : currentTask.value.end.getMonth()+1) + '-' + (currentTask.value.end.getDate() < 10 ? `0${currentTask.value.end.getDate()}` : currentTask.value.end.getDate())
    formTask.value.endTime = (currentTask.value.end.getHours() < 10 ? `0${currentTask.value.end.getHours()}` : currentTask.value.end.getHours()) + ':' + (currentTask.value.end.getMinutes() < 10 ? `0${currentTask.value.end.getMinutes()}` : currentTask.value.end.getMinutes())
  }
  taskFormOpen.value = true
}

// edit task
async function editTask(isActive) {
  const { valid } = await taskForm.value.validate()

  if(valid) {
    let api = calendarMain.value.getApi()
    api.getEventById(currentTask.value.id).setProp('title', formTask.value.title)
    api.getEventById(currentTask.value.id).setProp('color', formTask.value.color)
    api.getEventById(currentTask.value.id).setAllDay(formTask.value.allDay)
    if(formTask.value.allDay) {
      api.getEventById(currentTask.value.id).setStart(new Date(formTask.value.start).getTime(), { maintainDuration: true })
    } else {
      let taskStart = ''
      let taskEnd = ''
      if(formTask.value.startTime) {
        taskStart = formTask.value.start + ' ' + formTask.value.startTime
      } else {
        taskStart = formTask.value.start + ' 00:00'
      }
      if(formTask.value.endTime) {
        taskEnd = formTask.value.end + ' ' + formTask.value.endTime
      } else {
        if(formTask.value.start == formTask.value.end) {
          taskEnd = formTask.value.end + ' 01:00'
        } else {
          taskEnd = formTask.value.end + ' 00:00'
        }
      }
      if(formTask.value.startTime && !formTask.value.endTime) {
        taskEnd = formTask.value.end + ' ' + String(Number.parseInt(formTask.value.startTime.split(':')[0]) + 1) + ':' + formTask.value.startTime.split(':')[1]
      }

      api.getEventById(currentTask.value.id).setStart(new Date(taskStart).getTime())
      api.getEventById(currentTask.value.id).setEnd(new Date(taskEnd).getTime())
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
  calendarMain.value.getApi().changeView(newValue)
})
</script>