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

    <!-- add dialog -->
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
    <v-dialog v-model="taskInfoOpen" max-width="500">
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title>{{ taskInfo.title }}</v-card-title>
          <v-card-text>{{ taskInfo }}</v-card-text>
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

const calendarTasks = ref([])
// const calendarTasks = ref([
// {
//     title: 'Workout',
//     start: new Date('2024-08-12 18:00').getTime(),
//     end: new Date('2024-08-12 21:30').getTime(),
//     color: 'red',
//     allDay: false,
//   },
//   {
//     allDay: true,
//     title: 'Birthday',
//     date: new Date('2024-08-18').getTime(),
//     color: 'green',
//   },
// ])

onMounted(() => {
  let tasks = JSON.parse(localStorage.getItem('calendarTasks'))

  if(tasks) {
    for(let i = 0; i < tasks.length; i++) {
      calendar.value.getApi().addEvent(tasks[i])
    }
  }
  // localStorage.setItem('calendarTasks', JSON.stringify(calendarTasks.value))
})

watch(calendarTasks, async(newCalendarTasks, oldCalendarTasks) => {
  localStorage.setItem('calendarTasks', JSON.stringify(newCalendarTasks))
})

const calendarOptions = ref({
  plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
  initialView: 'dayGridMonth',
  events: calendarTasks.value,
  fixedWeekCount: false,

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
const title = ref(null)
const start = ref(null)
const end = ref(null)
const color = ref(null)
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
const taskInfo = ref({})

function showTaskInfo(eventClickInfo) {
  taskInfoOpen.value = true
  taskInfo.value = eventClickInfo.event
}
</script>