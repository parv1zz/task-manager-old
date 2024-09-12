<template>
  <v-toolbar color="white">
    <!-- controls -->
    <v-btn
      height="40"
      class="mr-2"
      variant="outlined"
      slim
      @click="calendarApi.today()"
    >{{ $t('Header.today') }}</v-btn>
    <div>
      <v-btn
        icon=""
        size="small"
        variant="text"
        @click="calendarApi.prev()"
      ><v-icon size="x-large">mdi-chevron-left</v-icon></v-btn>
      <v-btn
        icon=""
        size="small"
        variant="text"
        @click="calendarApi.next()"
      ><v-icon size="x-large">mdi-chevron-right</v-icon></v-btn>
    </div>
    <!-- title -->
    <div>
      <v-hover>
        <template v-slot:default="{ isHovering, props }">
          <div v-bind="props" class="d-flex align-center cursor-pointer px-2 rounded" :class="isHovering ? 'bg-grey-lighten-2' : ''">
            <div id="today-title"></div>
            <v-icon>mdi-menu-down</v-icon>
            <v-menu activator="parent" :close-on-content-click="false" v-model="titleDateOpen">
              <v-date-picker color="primary" show-adjacent-months hide-header v-model="titleDate"></v-date-picker>
            </v-menu>
          </div>
        </template>
      </v-hover>
    </div>

    <v-spacer></v-spacer>

    <!-- select -->
    <v-select
      max-width="140"
      :items="calendarViewModes"
      v-model="calendarViewMode"
      class="mr-2"
      density="compact"
      variant="outlined"
      hide-details
    >
      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props" :title="$t(`Header.${item.title}`)">
          <template v-slot:prepend>
            <v-list-item-action>
              <v-icon v-if="item.title == 'month'" icon="mdi-calendar-month"></v-icon>
              <v-icon v-if="item.title == 'week'" icon="mdi-calendar-week"></v-icon>
              <v-icon v-if="item.title == 'day'" icon="mdi-calendar-today"></v-icon>
            </v-list-item-action>
          </template>
        </v-list-item>
      </template>
      <template v-slot:selection="{ item, index }">
        <v-icon class="ml-n1" v-if="item.title == 'month'" icon="mdi-calendar-month"></v-icon>
        <v-icon class="ml-n1" v-if="item.title == 'week'" icon="mdi-calendar-week"></v-icon>
        <v-icon class="ml-n1" v-if="item.title == 'day'" icon="mdi-calendar-today"></v-icon>
        <div class="ml-3">{{ $t(`Header.${item.title}`) }}</div>
      </template>
    </v-select>
    
    <!-- btns -->
    <v-toolbar-items>
      <v-btn @click="notify({ title: 'This is title', body: 'This is text of notification' }, new Date(Date.now() + 10 * 1000), { taskId: 1, reminderId: 1 })">Notify</v-btn>
      <v-btn @click="cancelNotification(1, 1)">Cancel</v-btn>
      <v-btn
        elevation="0"
        prepend-icon="mdi-plus"
        @click="addTaskClick"
        color="primary"
      >{{ $t('TaskForm.addTask') }}</v-btn>
      <Settings />
    </v-toolbar-items>
  </v-toolbar>
</template>

<script setup>
import Settings from '@/components/Settings'
import { calendarApi, calendarViewMode, calendarViewModes } from '@/scripts/calendar'
import { taskFormEditing, taskFormOpen, formValues } from '@/scripts/form'
import { appLocale } from '@/scripts/locale'
import { colors } from '@/scripts/settings'
import { cancelNotification, notify } from '~/scripts/notification'

const titleDateOpen = ref(false)
const titleDate = ref(null)
watch(titleDate, (n) => {
  calendarApi.gotoDate(n)
  titleDateOpen.value = false
})

function addTaskClick() {
  taskFormEditing.value = false
  taskFormOpen.value = true

  let date = new Date()
  formValues.value.color = colors[2].value
  formValues.value.start = date.toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
  formValues.value.end = date.toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
}
</script>