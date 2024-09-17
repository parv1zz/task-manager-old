<template>
  <div class="flex flex-col overflow-hidden h-screen">
    <Header />

    <div class="flex-grow">
      <FullCalendar
        :options="calendarOptions"
        ref="calendar"
        class="w-full"
      >
      </FullCalendar>
    </div>

    <TaskForm />
    <TaskInfo />

    <Snackbars />
  </div>
</template>

<script setup>
// head
useHead({
  title: 'Task manager',
})

// calendar
import FullCalendar from '@fullcalendar/vue3'
import { calendarApi, calendarOptions, initCalendar, reminderDone } from '@/scripts/calendar'
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
import { sendToken } from '~/scripts/notification'
import { snackbars } from '~/scripts/snackbars'
const { $messaging } = useNuxtApp()

onMounted(() => {
  sendToken()
  // init
  initCalendar(calendar.value.getApi())
  getLocale()

  onMessage($messaging, payload => {
    console.log('Message on client: ', payload)

    // snackbar
    snackbars.value[0].open = false
    snackbars.value[0].open = true
    snackbars.value[0].title = payload.notification.title
    snackbars.value[0].text = payload.notification.body

    if(payload.data) {
      reminderDone(payload.data.taskId, payload.data.reminderId)
    } else {
      console.log('no data')
    }
  })

  const idsBroadcast = new BroadcastChannel('ids')
  idsBroadcast.onmessage = (event) => {
    reminderDone(event.data.taskId, event.data.reminderId)
  }
})
</script>