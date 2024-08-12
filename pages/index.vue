<template>
  <v-app>
    <!-- <div>{{ calendarTasks }}</div> -->
    <div class="container overflow-hidden">
      <div>
        <FullCalendar
          ref="calendar"
          :options="calendarOptions"
          >
        </FullCalendar>
      </div>
    </div>

    <!-- add task dialog -->
    <v-dialog activator=".fc-addTask-button" max-width="500">
      <template v-slot:default="{ isActive }">
        <v-card title="Add task">
          <v-card-text class="pb-0">
            <v-form ref="form">
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
                    <v-text-field
                      v-model="color"
                      :rules="rules"
                      label="Color"
                      required
                      persistent-placeholder
                    />
                  </v-col>
                </v-row>
                <v-row v-if="!allDay">
                  <v-col class="pt-0">
                    <v-text-field
                      v-model="start"
                      :rules="dateRules"
                      label="Start"
                      required
                      persistent-placeholder
                      placeholder="yyyy-mm-dd hh:mm"
                    />
                  </v-col>
                  <v-col class="pt-0">
                    <v-text-field
                      v-model="end"
                      :rules="dateRules"
                      label="End"
                      required
                      persistent-placeholder
                      placeholder="yyyy-mm-dd hh:mm"
                    />
                  </v-col>
                </v-row>
                <v-row v-if="allDay">
                  <v-col class="pt-0">
                    <v-text-field
                      v-model="start"
                      :rules="dateRules"
                      label="Date"
                      required
                      persistent-placeholder
                      placeholder="yyyy-mm-dd"
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
              text="Close"
              @click="cancel(isActive)"
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
              <v-badge ref="badge" class="mx-n1" inline :color="currentTask.backgroundColor"></v-badge>
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
            <v-btn icon="mdi-delete" @click="deleteTask"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <!-- edit task dialog -->
    <v-dialog v-model="taskEditOpen" @afterLeave="console.log(currentTask)" max-width="500">
      <template v-slot:default="{ isActive }">
        <v-card title="Edit task">
          <v-card-text class="pb-0">
            <v-form ref="formEdit">
              <v-container class="pa-0">
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="titleEdit"
                      :rules="rules"
                      label="Title"
                      required
                      persistent-placeholder
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="colorEdit"
                      :rules="rules"
                      label="Color"
                      required
                      persistent-placeholder
                    />
                  </v-col>
                </v-row>
                <v-row v-if="!allDayEdit">
                  <v-col class="pt-0">
                    <v-text-field
                      v-model="startEdit"
                      :rules="dateRules"
                      label="Start"
                      required
                      persistent-placeholder
                      placeholder="yyyy-mm-dd hh:mm"
                    />
                  </v-col>
                  <v-col class="pt-0">
                    <v-text-field
                      v-model="endEdit"
                      :rules="dateRules"
                      label="End"
                      required
                      persistent-placeholder
                      placeholder="yyyy-mm-dd hh:mm"
                    />
                  </v-col>
                </v-row>
                <v-row v-if="allDayEdit">
                  <v-col class="pt-0">
                    <v-text-field
                      v-model="startEdit"
                      :rules="dateRules"
                      label="Date"
                      required
                      persistent-placeholder
                      placeholder="yyyy-mm-dd"
                    />
                  </v-col>
                </v-row>
              </v-container>
              <v-checkbox v-model="allDayEdit" label="All day" hide-details></v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text="Edit"
              @click="editTask(isActive)"
            ></v-btn>
            <v-btn
              text="Cancel"
              @click="cancelEdit(isActive)"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-app>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const calendar = ref()

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
      calendar.value.getApi().addEvent(tasks[i])
    }
  }
})

watch(calendarTasks, async(newCalendarTasks, oldCalendarTasks) => {
  localStorage.setItem('calendarTasks', JSON.stringify(newCalendarTasks))
})

const calendarOptions = ref({
  plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
  initialView: 'dayGridMonth',
  events: calendarTasks.value,
  fixedWeekCount: false,
  snapDuration: '00:15:00',

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
    right: 'dayGridMonth,timeGridWeek,timeGridDay addTask',
  },

  editable: true,
  dayMaxEvents: true,
  navLinks: true,
  eventsSet: updateTasks,
  navLinkDayClick: function(date, jsEvent) {
    calendar.value.getApi().changeView('timeGridDay')
    calendar.value.getApi().gotoDate(date)
  },
  eventClick: showTaskInfo
})
function updateTasks(events) {
  calendarTasks.value = events
}

const form = ref()
const title = ref('')
const start = ref('')
const end = ref('')
const color = ref('')
const allDay = ref(false)
const rules = ref([v => !!v || 'required'])
const dateRules = ref([
  v => !!v || 'required',
  v => (v && !isNaN(new Date(v))) || 'date is not valid',
])
async function addTask(isActive) {
  const { valid } = await form.value.validate()

  if(valid) {
    let newTask =  {
      id: createTaskId(),
      title: title.value,
      start: new Date(start.value).getTime(),
      end: new Date(end.value).getTime(),
      color: color.value,
      allDay: allDay.value,
    }
    
    calendar.value.getApi().addEvent(newTask)
    cancel(isActive)
  }
}
function cancel(isActive) {
  form.value.reset()
  isActive.value = false
  start.value = ''
  end.value = ''
}

const taskInfoOpen = ref(false)
const currentTask = ref({})
const taskEditOpen = ref(false)
const badge = ref()

const formEdit = ref()
const titleEdit = ref('')
const startEdit = ref('')
const endEdit = ref('')
const colorEdit = ref('')
const allDayEdit = ref(false)

function showTaskInfo(eventClickInfo) {
  taskInfoOpen.value = true
  currentTask.value = eventClickInfo.event
}
function checkDays(day1, day2) {
  return new Date(`${new Date(day1).getFullYear()} ${new Date(day1).getMonth()+1} ${new Date(day1).getDate()}`).getTime() == new Date(`${new Date(day2).getFullYear()} ${new Date(day2).getMonth()+1} ${new Date(day2).getDate()}`).getTime()
}
function deleteTask() {
  calendar.value.getApi().getEventById(currentTask.value.id).remove()
  taskInfoOpen.value = false
}
function editClick() {
  titleEdit.value = currentTask.value.title
  colorEdit.value = currentTask.value.backgroundColor
  allDayEdit.value = currentTask.value.allDay

  if(currentTask.value.allDay) {
    startEdit.value = currentTask.value.start.getFullYear() + '-' + (currentTask.value.start.getMonth()+1) + '-' + currentTask.value.start.getDate()
  } else {
    startEdit.value = currentTask.value.start.getFullYear() + '-' + (currentTask.value.start.getMonth()+1) + '-' + currentTask.value.start.getDate() + ' ' + currentTask.value.start.getHours() + ':' + (currentTask.value.start.getMinutes() < 10 ? `0${currentTask.value.start.getMinutes()}` : currentTask.value.start.getMinutes())
    endEdit.value = currentTask.value.end.getFullYear() + '-' + (currentTask.value.end.getMonth()+1) + '-' + currentTask.value.end.getDate() + ' ' + currentTask.value.end.getHours() + ':' + (currentTask.value.start.getMinutes() < 10 ? `0${currentTask.value.start.getMinutes()}` : currentTask.value.start.getMinutes())
  }
  taskEditOpen.value = true
}
async function editTask(isActive) {
  const { valid } = await formEdit.value.validate()

  if(valid) {
    calendar.value.getApi().getEventById(currentTask.value.id).setProp('title', titleEdit.value)
    calendar.value.getApi().getEventById(currentTask.value.id).setProp('color', colorEdit.value)
    calendar.value.getApi().getEventById(currentTask.value.id).setAllDay(allDayEdit.value)
    if(allDayEdit.value) {
      calendar.value.getApi().getEventById(currentTask.value.id).setStart(new Date(startEdit.value).getTime(), { maintainDuration: true })
    } else {
      calendar.value.getApi().getEventById(currentTask.value.id).setStart(new Date(startEdit.value).getTime())
      calendar.value.getApi().getEventById(currentTask.value.id).setEnd(new Date(endEdit.value).getTime())
    }
    
    taskInfoOpen.value = false
    cancelEdit(isActive)
  }
}
function cancelEdit(isActive) {
  formEdit.value.reset()
  isActive.value = false
  startEdit.value = ''
  endEdit.value = ''
}
</script>