<template>
  <v-dialog
    v-model="taskInfoOpen"
    @afterLeave="infoTask = {}"
    v-if="!infoTask.hasOwnProperty('title')"
    max-width="400"
  >
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title>{{ $t('TaskInfo.taskInfo') }}</v-card-title>
        <v-card-subtitle v-if="infoTask.allDay">{{ $t('TaskForm.allDay') }}</v-card-subtitle>
        <v-card-text>
          <div class="d-flex align-center ga-2">
            <v-badge class="mx-n1" inline :color="infoTask.backgroundColor"></v-badge>
            <h3 style="font-size: 20px;">{{ infoTask.title }}</h3>
          </div>
          <div v-if="infoTask.allDay" class="mt-2 text-body-2">{{ infoTask.start.toLocaleString(appLocale, {day: 'numeric', month: 'short', year: 'numeric'}) }}</div>
          <div>
            <div v-if="(!infoTask.allDay && checkDays(infoTask.start, infoTask.end))" class="mt-2 text-body-2">
              <span>{{ infoTask.start.toLocaleString(appLocale, {day: 'numeric', month: 'short', year: 'numeric'}) }} • </span>
              <span class="font-weight-bold">{{ infoTask.start.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' ? true : false }) }}</span>
              <span> - </span>
              <span class="font-weight-bold">{{ infoTask.end.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' ? true : false }) }}</span>
              <span class="text-body-2" v-if="!infoTask.allDay"> ({{ getDatesDuration(infoTask.start, infoTask.end) }})</span>
            </div>
            <div v-if="(!infoTask.allDay && !checkDays(infoTask.start, infoTask.end))" class="mt-2 text-body-2">
              <span>{{ infoTask.start.toLocaleString(appLocale, {day: 'numeric', month: 'short', year: 'numeric'}) }}</span>
              <span class="font-weight-bold">{{ ' ' + infoTask.start.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' ? true : false }) }}</span>
              <span> - {{ infoTask.end.toLocaleString(appLocale, {day: 'numeric', month: 'short', year: 'numeric'}) }}</span>
              <span class="font-weight-bold">{{ ' ' + infoTask.end.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' ? true : false }) }}</span>
              <div class="text-body-2" v-if="!infoTask.allDay"> ({{ getDatesDuration(infoTask.start, infoTask.end) }})</div>
            </div>
          </div>
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
  }
  taskFormOpen.value = true
}
</script>