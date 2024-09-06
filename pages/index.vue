<template>
  <div class="d-flex flex-column overflow-hidden" style="height: 100vh;">
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
import { getLocale, setVuetify, } from '@/scripts/locale'

const calendar = ref()

onMounted(() => {
  // init
  setVuetify(calendar.value.$vuetify)
  setCalendarApi(calendar.value.getApi())
  initCalendar()
  getTaskId()
  getTasks()
  getLocale()
})
</script>