<template>
  <div class="d-flex flex-column overflow-hidden" style="height: 100vh;">
    <v-btn @click="notify('a', 'b', new Date())">Notify</v-btn>
    <Header />

    <div class="flex-grow-1">
      <FullCalendar
        :options="calendarOptions"
        ref="calendar"
        class="w-100"
      >
      </FullCalendar>
    </div>

    <TaskForm />
    <TaskInfo />

    <v-snackbar
      v-model="snackbar.open"
      timeout="5000"
    >
      <h3>{{ snackbar.title }}</h3>
      <div>{{ snackbar.text }}</div>

      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="snackbar.open = false"
        >Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
// head
useHead({
  title: 'Task manager',
})

// calendar
import FullCalendar from '@fullcalendar/vue3'
import { calendarApi, setCalendarApi, calendarOptions, getTaskId, getTasks, initCalendar } from '@/scripts/calendar'
// header
import Header from '@/components/Header'
// dialogs
import TaskForm from '@/components/TaskForm'
import TaskInfo from '@/components/TaskInfo'
// locale
import { getLocale } from '@/scripts/locale'

const calendar = ref()

// messaging
import { onMessage } from 'firebase/messaging'
const { $messaging, $token } = useNuxtApp()
import { notify } from '~/scripts/notification'

const snackbar = ref({
  open: false,
  title: '',
  text: '',
})

onMounted(() => {
  // init
  setCalendarApi(calendar.value.getApi())
  initCalendar()
  getTaskId()
  getTasks()
  getLocale()

  onMessage($messaging, payload => {
    console.log('Message on client: ', payload)

    // snackbar
    snackbar.value.open = true
    snackbar.value.title = payload.notification.title
    snackbar.value.text = payload.notification.body
  })
})
</script>