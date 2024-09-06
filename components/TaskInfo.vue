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
          <v-list-item class="px-3" :class="infoTask.extendedProps.reminders.length > 0 ? 'mb-4' : ''">
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-badge class="mx-n1" inline :color="infoTask.backgroundColor"></v-badge>
              </v-list-item-action>
            </template>
            <v-list-item-title>
              <span class="text-22 font-weight-regular">{{ infoTask.title }}</span>
            </v-list-item-title>
            <v-list-item-subtitle class="mt-1" opacity="1">
              <div v-if="infoTask.allDay" class="text-14">{{ infoTask.start.toLocaleString(appLocale, {day: 'numeric', month: 'short', year: 'numeric'}) }}</div>
              <div>
                <div v-if="(!infoTask.allDay && checkDays(infoTask.start, infoTask.end))" class="text-14">
                  <span>{{ infoTask.start.toLocaleString(appLocale, {day: 'numeric', month: 'short', year: 'numeric'}) }} • </span>
                  <span class="font-weight-bold">{{ infoTask.start.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' ? true : false }) }}</span>
                  <span> - </span>
                  <span class="font-weight-bold">{{ infoTask.end.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' ? true : false }) }}</span>
                  <span class="text-14 font-weight-bold" v-if="!infoTask.allDay"> ({{ getDatesDuration(infoTask.start, infoTask.end) }})</span>
                </div>
                <div v-if="(!infoTask.allDay && !checkDays(infoTask.start, infoTask.end))" class="text-14">
                  <span>{{ infoTask.start.toLocaleString(appLocale, {day: 'numeric', month: 'short', year: 'numeric'}) }}</span>
                  <span class="font-weight-bold" v-if="infoTask.start.toLocaleString('ru', { hour: 'numeric', minute: 'numeric'}) != '00:00'">{{ ' ' + infoTask.start.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' ? true : false }) }}</span>
                  <span> - {{ infoTask.end.toLocaleString(appLocale, {day: 'numeric', month: 'short', year: 'numeric'}) }}</span>
                  <span class="font-weight-bold" v-if="infoTask.end.toLocaleString('ru', { hour: 'numeric', minute: 'numeric'}) != '00:00'">{{ ' ' + infoTask.end.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' ? true : false }) }}</span>
                  <span class="text-14 font-weight-bold" v-if="!infoTask.allDay"> ({{ getDatesDuration(infoTask.start, infoTask.end) }})</span>
                </div>
              </div>
            </v-list-item-subtitle>
          </v-list-item>
          <!-- reminders -->
          <v-list-item class="px-3" v-if="infoTask.extendedProps.reminders.length > 0">
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-icon size="small">mdi-bell-outline</v-icon>
              </v-list-item-action>
            </template>
            <v-list-item-title class="d-flex flex-wrap" style="gap: 4px;">
              <v-chip size="small" :class="reminder.done ? 'text-decoration-line-through' : ''" v-for="reminder in infoTask.extendedProps.reminders">{{ $t(`reminders.${reminder.title}`) }}</v-chip>
            </v-list-item-title>
          </v-list-item>
        </v-card-text>

        <v-card-actions>
          <v-btn icon="mdi-pencil" @click="editTaskClick"></v-btn>
          <v-btn icon="mdi-delete" @click="deleteTask(infoTask); isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { taskFormOpen, taskFormEditing, formValues } from '@/scripts/form'
import { taskInfoOpen, infoTask } from '@/scripts/info'
import { checkDays, getDatesDuration } from '@/scripts/dates'
import { appLocale } from '@/scripts/locale'
import { deleteTask } from '@/scripts/calendar'

function editTaskClick() {
  taskFormEditing.value = true

  formValues.value.title = infoTask.value.title
  formValues.value.color = infoTask.value.backgroundColor
  formValues.value.allDay = infoTask.value.allDay
  formValues.value.start = infoTask.value.start.toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
  formValues.value.end = infoTask.value.start.toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})

  if(!infoTask.value.allDay) {
    formValues.value.startTime = infoTask.value.start.toLocaleString(appLocale.value, {hour: '2-digit', minute: '2-digit'})
    formValues.value.endTime = infoTask.value.end.toLocaleString(appLocale.value, {hour: '2-digit', minute: '2-digit'})
    formValues.value.end = infoTask.value.end.toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
  }
  taskFormOpen.value = true
}
</script>