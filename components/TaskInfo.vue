<template>
  <v-dialog
    v-model="taskInfoOpen"
    @afterLeave="infoTask = {}"
    max-width="400"
  >
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>{{ $t('TaskInfo.taskInfo') }}</v-card-title>
        <v-card-subtitle v-if="infoTask.allDay">{{ $t('TaskForm.allDay') }}</v-card-subtitle>
        <v-card-text class="py-1">
          <!-- info -->
          <v-list-item class="px-3 mb-4">
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-badge class="mx-n1" inline :color="infoTask.backgroundColor"></v-badge>
              </v-list-item-action>
            </template>
            <v-list-item-title>
              <span class="text-[22px]">{{ infoTask.title }}</span>
            </v-list-item-title>
            <!-- {{ infoTask }} -->
            <v-list-item-subtitle class="mt-1" opacity="1">
              <!-- all day -->
              <div v-if="infoTask.allDay" class="text-sm">
                <span>{{ infoTask.start.toLocaleString(appLocale, {day: 'numeric', month: 'numeric', year: 'numeric'}) }}</span>
                <span v-if="!checkDays(infoTask.start, infoTask.end)"> - {{ infoTask.end.toLocaleString(appLocale, {day: 'numeric', month: 'numeric', year: 'numeric'}) }}</span>
              </div>
              <!-- one day -->
              <div v-if="(!infoTask.allDay && checkDays(infoTask.start, infoTask.end))" class="text-sm">
                <!-- date -->
                <span>{{ infoTask.start.toLocaleString(appLocale, {day: 'numeric', month: 'numeric', year: 'numeric'}) }}, </span>
                <!-- time start -->
                <span class="font-bold">{{ infoTask.start.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' }) }}</span>
                <span> - </span>
                <!-- time end -->
                <span class="font-bold">{{ infoTask.end.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' }) }}</span>
                <!-- duration -->
                <span class="font-bold" v-if="!infoTask.allDay"> ({{ getDatesDuration(infoTask.start, infoTask.end) }})</span>
              </div>
              <!-- many days -->
              <div v-if="(!infoTask.allDay && !checkDays(infoTask.start, infoTask.end))" class="text-sm">
                <!-- start date -->
                <span>{{ infoTask.start.toLocaleString(appLocale, {day: 'numeric', month: 'numeric', year: 'numeric'}) }}, </span>
                <!-- start time -->
                <span class="font-bold">{{ ' ' + infoTask.start.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' }) }}</span>
                <!-- end date -->
                <span> - {{ infoTask.end.toLocaleString(appLocale, {day: 'numeric', month: 'numeric', year: 'numeric'}) }}, </span>
                <!-- end time -->
                <span class="font-bold">{{ ' ' + infoTask.end.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' }) }}</span>
                <!-- duration -->
                <span class="text-sm font-bold" v-if="!infoTask.allDay"> ({{ getDatesDuration(infoTask.start, infoTask.end) }})</span>
              </div>
            </v-list-item-subtitle>
          </v-list-item>
          <!-- desc -->
          <v-list-item class="px-3">
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-icon size="small">mdi-menu</v-icon>
              </v-list-item-action>
            </template>
            <v-list-item-title class="flex flex-wrap gap-1">
              <span>qwr qewrqwerqwer qwerqwerqw qweqwe qwerwqer qw qwerqwerwqer qw.</span>
            </v-list-item-title>
          </v-list-item>
          <!-- reminders -->
          <v-list-item class="px-3" v-if="infoTask.extendedProps.reminders.length > 0">
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-icon size="small">mdi-bell-outline</v-icon>
              </v-list-item-action>
            </template>
            <v-list-item-title class="flex flex-wrap gap-1">
              <v-chip label size="small" :class="reminder.done ? 'text-decoration-line-through' : ''" v-for="reminder in infoTask.extendedProps.reminders">{{ $t(`reminders.${reminder.title}`) }}</v-chip>
            </v-list-item-title>
          </v-list-item>
        </v-card-text>

        <v-card-actions>
          <v-btn icon="mdi-pencil" @click="editTaskClick"></v-btn>
          <v-btn icon="mdi-delete" @click="deleteTaskClick(isActive)"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { taskFormOpen, taskFormEditing, formValues, reminders, reminderId, isEditingFromForm, taskFormEdited } from '@/scripts/form'
import { taskInfoOpen, infoTask } from '@/scripts/info'
import { checkDays, getDatesDuration } from '@/scripts/dates'
import { appLocale } from '@/scripts/locale'
import { deleteTask } from '@/scripts/calendar'
import { refreshNotifications } from '~/scripts/notification'
import { snackbars } from '~/scripts/snackbars'

function editTaskClick() {
  isEditingFromForm.value = true
  taskFormEditing.value = true
  taskFormOpen.value = true

  formValues.value.title = infoTask.value.title
  formValues.value.color = infoTask.value.backgroundColor
  formValues.value.allDay = infoTask.value.allDay
  formValues.value.start = infoTask.value.start.toLocaleDateString(appLocale.value, {year: 'numeric', month: 'numeric', day: 'numeric'})
  formValues.value.end = infoTask.value.end.toLocaleDateString(appLocale.value, {year: 'numeric', month: 'numeric', day: 'numeric'})

  if(!infoTask.value.allDay) {
    formValues.value.startTime = infoTask.value.start.toLocaleString(appLocale.value, {hour: 'numeric', minute: 'numeric'})
    formValues.value.endTime = infoTask.value.end.toLocaleString(appLocale.value, {hour: 'numeric', minute: 'numeric'})
  }

  if(infoTask.value.extendedProps.reminders.length > 0) {
    reminders.value = JSON.parse(JSON.stringify(infoTask.value.extendedProps.reminders))
    reminderId.value = reminders.value[reminders.value.length-1].id
  }
}

function deleteTaskClick(isActive) {
  refreshNotifications(infoTask.value.id, [])
  deleteTask(infoTask.value)
  isActive.value = false

  // snackbar
  snackbars.value[3].open = false
  snackbars.value[3].open = true
  snackbars.value[3].title = infoTask.value.title
  snackbars.value[3].text = 'deleted'
}
</script>