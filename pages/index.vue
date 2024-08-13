<template>
  <v-app>
    <div class="container overflow-hidden">
      <div>
        <FullCalendar
          ref="calendarMain"
          :options="calendarMainOptions"
          >
        </FullCalendar>
      </div>
    </div>

    <!-- add task dialog -->
    <v-dialog activator=".fc-addTask-button" @afterLeave="formAdd.reset()" max-width="600">
      <template v-slot:default="{ isActive }">
        <v-card title="Add task">
          <v-card-text class="pb-0">
            <v-form ref="formAdd">
              <v-container class="pa-0">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="title"
                      :rules="rules"
                      label="Title"
                      required
                      persistent-placeholder
                    />
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="color"
                      :items="colors"
                      label="Color"
                      persistent-placeholder
                    >
                      <template v-slot:append-item>
                        <v-divider></v-divider>
                        <v-list-item ref="pickColorBtn" @click="">pick color</v-list-item>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                <v-row v-if="!allDay">
                  <v-col class="pt-0 d-flex justify-space-between ga-2">
                    <v-text-field
                      max-width="160"
                      v-model="start"
                      required
                      :rules="dateRules"
                      label="Start"
                      persistent-placeholder
                      type="date"
                    />
                    <v-text-field
                      max-width="100"
                      v-model="startTime"
                      label="Time"
                      persistent-placeholder
                      type="time"
                    />
                  </v-col>
                  <v-col class="pt-0 d-flex justify-space-between ga-2">
                    <v-text-field
                      max-width="160"
                      v-model="end"
                      required
                      :rules="dateRules"
                      label="End"
                      persistent-placeholder
                      type="date"
                    />
                    <v-text-field
                      max-width="100"
                      v-model="endTime"
                      label="Time"
                      persistent-placeholder
                      type="time"
                    />
                  </v-col>
                </v-row>
                <v-row v-if="allDay">
                  <v-col class="pt-0">
                    <v-text-field
                      v-model="start"
                      required
                      :rules="rules"
                      label="Date"
                      persistent-placeholder
                      type="date"
                    />
                  </v-col>
                </v-row>
              </v-container>
              <v-checkbox v-model="allDay" label="All day" hide-details></v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text="Add"
              @click="addTask(isActive)"
            ></v-btn>
            <v-btn
              text="Cancel"
              @click="closeAddTask(isActive)"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <!-- info dialog -->
    <v-dialog v-model="taskInfoOpen" @afterLeave="currentTask = {}" v-if="!currentTask.hasOwnProperty('title')" max-width="400">
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title>Task info</v-card-title>
          <v-card-subtitle v-if="currentTask.allDay">All day</v-card-subtitle>
          <v-card-text>
            <div class="d-flex align-center ga-2">
              <v-badge class="mx-n1" inline :color="currentTask.backgroundColor"></v-badge>
              <h3 style="font-size: 20px;">{{ currentTask.title }}</h3>
            </div>
            <div v-if="currentTask.allDay" class="mt-2 text-body-2">{{ `${currentTask.start.getDate()} ${new Intl.DateTimeFormat('en', { month: 'short' }).format(currentTask.start)} ${currentTask.start.getFullYear()}` }}</div>
            <div v-if="(!currentTask.allDay && checkDays(currentTask.start, currentTask.end))" class="mt-2 text-body-2">
              <span>{{ `${currentTask.start.getDate()} ${new Intl.DateTimeFormat('en', { month: 'short' }).format(currentTask.start)} ${currentTask.start.getFullYear()} • ` }}</span>
              <span class="font-weight-bold">{{ `${currentTask.start.getHours()}:${currentTask.start.getMinutes() < 10 ? '0'+currentTask.start.getMinutes() : currentTask.start.getMinutes()}` }}</span>
              <span> - </span>
              <span class="font-weight-bold">{{ `${currentTask.end.getHours()}:${currentTask.end.getMinutes() < 10 ? '0'+currentTask.end.getMinutes() : currentTask.end.getMinutes()}` }}</span>
            </div>
            <div v-if="(!currentTask.allDay && !checkDays(currentTask.start, currentTask.end))" class="mt-2 text-body-2">
              <span>{{ `${currentTask.start.getDate()} ${new Intl.DateTimeFormat('en', { month: 'short' }).format(currentTask.start)} ${currentTask.start.getFullYear()}` }}</span>
              <span class="font-weight-bold">{{ ` ${currentTask.start.getHours()}:${currentTask.start.getMinutes() < 10 ? '0'+currentTask.start.getMinutes() : currentTask.start.getMinutes()}` }}</span>
              <span>{{ ` - ${currentTask.end.getDate()} ${new Intl.DateTimeFormat('en', { month: 'short' }).format(currentTask.end)} ${currentTask.end.getFullYear()}` }}</span>
              <span class="font-weight-bold">{{ ` ${currentTask.end.getHours()}:${currentTask.end.getMinutes() < 10 ? '0'+currentTask.end.getMinutes() : currentTask.end.getMinutes()}` }}</span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn icon="mdi-pencil" @click="editClick"></v-btn>
            <v-btn icon="mdi-delete" @click="deleteTask(isActive)"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <!-- edit task dialog -->
    <v-dialog v-model="taskEditOpen" @after-leave="formEdit.reset()" max-width="600">
      <template v-slot:default="{ isActive }">
        <v-card title="Edit task">
          <v-card-text class="pb-0">
            <v-form ref="formEdit">
              <v-container class="pa-0">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="title"
                      :rules="rules"
                      label="Title"
                      required
                      persistent-placeholder
                    />
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="color"
                      :items="colors"
                      :rules="rules"
                      label="Color"
                      required
                      persistent-placeholder
                    >
                      <template v-slot:append-item>
                        <v-divider></v-divider>
                        <v-list-item ref="pickColorBtn" @click="">pick color</v-list-item>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                <v-row v-if="!allDay">
                  <v-col class="pt-0 d-flex justify-space-between ga-2">
                    <v-text-field
                      max-width="160"
                      v-model="start"
                      required
                      :rules="dateRules"
                      label="Start"
                      persistent-placeholder
                      type="date"
                    />
                    <v-text-field
                      max-width="100"
                      v-model="startTime"
                      label="Time"
                      persistent-placeholder
                      type="time"
                    />
                  </v-col>
                  <v-col class="pt-0 d-flex justify-space-between ga-2">
                    <v-text-field
                      max-width="160"
                      v-model="end"
                      required
                      :rules="dateRules"
                      label="End"
                      persistent-placeholder
                      type="date"
                    />
                    <v-text-field
                      max-width="100"
                      v-model="endTime"
                      label="Time"
                      persistent-placeholder
                      type="time"
                    />
                  </v-col>
                </v-row>
                <v-row v-if="allDay">
                  <v-col class="pt-0">
                    <v-text-field
                      v-model="start"
                      required
                      :rules="rules"
                      label="Date"
                      persistent-placeholder
                      type="date"
                    />
                  </v-col>
                </v-row>
              </v-container>
              <v-checkbox v-model="allDay" label="All day" hide-details></v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text="Edit"
              @click="editTask(isActive)"
            ></v-btn>
            <v-btn
              text="Cancel"
              @click="closeEditTask(isActive)"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <!-- color pick dialog -->
    <v-dialog :activator="pickColorBtn" @afterLeave="pickerColor='';" max-width="332">
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-text class="pa-4">
            <v-color-picker v-model="pickerColor" hide-inputs></v-color-picker>
          </v-card-text>
          <v-card-actions>            
            <v-btn
              text="Pick"
              @click="pickColor(isActive)"
            ></v-btn>
            <v-btn
              text="Close"
              @click="isActive.value = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-app>
</template>

<script setup>
useHead({
  title: 'Task manager',
})

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

const calendarMain = ref()

let taskId;
function createTaskId() {
  taskId++
  localStorage.setItem('id', JSON.stringify(taskId))
  return String(taskId)
}

const calendarTasks = ref([])

onMounted(() => {
  taskId = JSON.parse(localStorage.getItem('id'))

  let tasks = JSON.parse(localStorage.getItem('calendarTasks'))

  if(tasks) {
    for(let i = 0; i < tasks.length; i++) {
      calendarMain.value.getApi().addEvent(tasks[i])
    }
  }
})

watch(calendarTasks, async(newCalendarTasks, oldCalendarTasks) => {
  localStorage.setItem('calendarTasks', JSON.stringify(newCalendarTasks))
})

const calendarMainOptions = ref({
  plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin ],
  initialView: 'dayGridMonth',
  events: calendarTasks.value,
  fixedWeekCount: false,
  snapDuration: '00:15:00',
  firstDay: 1,

  height: '100vh',

  customButtons: {
    addTask: {
      text: '+ Add task',
      click: function() {},
    },
  },
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth addTask',
  },

  editable: true,
  dayMaxEvents: true,
  navLinks: true,
  eventsSet: updateTasks,
  navLinkDayClick: function(date, jsEvent) {
    let api = calendarMain.value.getApi()
    api.changeView('timeGridDay')
    api.gotoDate(date)
  },
  eventClick: showTaskInfo
})
function updateTasks(events) {
  calendarTasks.value = events
}

// add task
const formAdd = ref()
const pickColorBtn = ref()
const colors = ref(['red', 'green', 'blue', 'orange', 'purple',])
const pickerColor = ref('')
function pickColor(isActive) {
  color.value = pickerColor.value
  isActive.value = false
}

const title = ref('')
const start = ref('')
const startTime = ref('')
const end = ref('')
const endTime = ref('')
const color = ref('')
const allDay = ref(false)
const checkValue = v => !!v || 'required'
const compareStartEnd = () => {
  if(start.value && end.value) {
    return ((new Date(start.value).getTime() <= new Date(end.value).getTime()) && (start.value != '' || end.value != '')) || 'wrong dates'
  } else {
    return ''
  }
}
const rules = ref([checkValue])
const dateRules = ref([checkValue , compareStartEnd])

async function addTask(isActive) {
  const { valid } = await formAdd.value.validate()

  if(valid) {
    let taskStart = ''
    let taskEnd = ''
    if(startTime.value) {
      taskStart = start.value + ' ' + startTime.value
    } else {
      taskStart = start.value + ' 00:00'
    }
    if(endTime.value) {
      taskEnd = end.value + ' ' + endTime.value
    } else {
      if(start.value == end.value) {
        taskEnd = end.value + ' 01:00'
      } else {
        taskEnd = end.value + ' 00:00'
      }
    }
    if(startTime.value && !endTime.value) {
      taskEnd = end.value + ' ' + String(Number.parseInt(startTime.value.split(':')[0]) + 1) + ':' + startTime.value.split(':')[1]
    }

    let newTask =  {
      id: createTaskId(),
      title: title.value,
      start: new Date(taskStart).getTime(),
      end: new Date(taskEnd).getTime(),
      color: color.value ? color.value : 'blue',
      allDay: allDay.value,
    }

    calendarMain.value.getApi().addEvent(newTask)
    closeAddTask(isActive)
  }
}
function closeAddTask(isActive) {
  formAdd.value.reset()
  isActive.value = false
}

// task info and edit
const taskInfoOpen = ref(false)
const currentTask = ref({})
const taskEditOpen = ref(false)

const formEdit = ref()

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
function editClick() {
  title.value = currentTask.value.title
  color.value = currentTask.value.backgroundColor
  allDay.value = currentTask.value.allDay

  if(currentTask.value.allDay) {
    start.value = currentTask.value.start.getFullYear() + '-' + (currentTask.value.start.getMonth()+1 < 10 ? `0${currentTask.value.start.getMonth()+1}` : currentTask.value.start.getMonth()+1) + '-' + (currentTask.value.start.getDate() < 10 ? `0${currentTask.value.start.getDate()}` : currentTask.value.start.getDate())
  } else {
    start.value = currentTask.value.start.getFullYear() + '-' + (currentTask.value.start.getMonth()+1 < 10 ? `0${currentTask.value.start.getMonth()+1}` : currentTask.value.start.getMonth()+1) + '-' + (currentTask.value.start.getDate() < 10 ? `0${currentTask.value.start.getDate()}` : currentTask.value.start.getDate())
    startTime.value = (currentTask.value.start.getHours() < 10 ? `0${currentTask.value.start.getHours()}` : currentTask.value.start.getHours()) + ':' + (currentTask.value.start.getMinutes() < 10 ? `0${currentTask.value.start.getMinutes()}` : currentTask.value.start.getMinutes())

    end.value = currentTask.value.end.getFullYear() + '-' + (currentTask.value.end.getMonth()+1 < 10 ? `0${currentTask.value.end.getMonth()+1}` : currentTask.value.end.getMonth()+1) + '-' + (currentTask.value.end.getDate() < 10 ? `0${currentTask.value.end.getDate()}` : currentTask.value.end.getDate())
    endTime.value = (currentTask.value.end.getHours() < 10 ? `0${currentTask.value.end.getHours()}` : currentTask.value.end.getHours()) + ':' + (currentTask.value.end.getMinutes() < 10 ? `0${currentTask.value.end.getMinutes()}` : currentTask.value.end.getMinutes())
  }
  taskEditOpen.value = true
}
async function editTask(isActive) {
  const { valid } = await formEdit.value.validate()

  if(valid) {
    let api = calendarMain.value.getApi()
    api.getEventById(currentTask.value.id).setProp('title', title.value)
    api.getEventById(currentTask.value.id).setProp('color', color.value)
    api.getEventById(currentTask.value.id).setAllDay(allDay.value)
    if(allDay.value) {
      api.getEventById(currentTask.value.id).setStart(new Date(start.value).getTime(), { maintainDuration: true })
    } else {
      let taskStart = ''
      let taskEnd = ''
      if(startTime.value) {
        taskStart = start.value + ' ' + startTime.value
      } else {
        taskStart = start.value + ' 00:00'
      }
      if(endTime.value) {
        taskEnd = end.value + ' ' + endTime.value
      } else {
        if(start.value == end.value) {
          taskEnd = end.value + ' 01:00'
        } else {
          taskEnd = end.value + ' 00:00'
        }
      }
      if(startTime.value && !endTime.value) {
        taskEnd = end.value + ' ' + String(Number.parseInt(startTime.value.split(':')[0]) + 1) + ':' + startTime.value.split(':')[1]
      }

      api.getEventById(currentTask.value.id).setStart(new Date(taskStart).getTime())
      api.getEventById(currentTask.value.id).setEnd(new Date(taskEnd).getTime())
    }
    
    taskInfoOpen.value = false
    closeEditTask(isActive)
  }
}
function closeEditTask(isActive) {
  formEdit.value.reset()
  isActive.value = false
}
</script>