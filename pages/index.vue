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
import { calendarApi, setCalendarApi, getTaskId, calendarOptions, getTasks, calendarViewMode, calendarViewModes, initCalendar } from '@/scripts/calendar'
// form
import { taskFormOpen, taskFormEditing, formValues } from '@/scripts/form'
// task info
import { infoTask } from '@/scripts/info'
// header
import Header from '@/components/Header'
// dialogs
import TaskForm from '@/components/TaskForm'
import TaskInfo from '@/components/TaskInfo'
// locale
import { appLocale, getLocale, locales, setVuetify, changeLocale } from '@/scripts/locale'
// settings
import { settings } from '@/scripts/settings'

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