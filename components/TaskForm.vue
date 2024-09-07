<template>
  <v-dialog
    width="450"
    max-height="600"
    v-model="taskFormOpen"
    @afterLeave="taskForm.reset(); calendarApi.unselect(); resetRemindes()"
  >
    <template v-slot:default="{ isActive }">
      <v-card :title="!taskFormEditing ? $t('TaskForm.addTask') : $t('TaskForm.editTask')">
        <v-card-text class="pb-0">
          <v-form ref="taskForm">
            <div class="d-flex ga-2 mb-2">
              <div class="flex-grow-1">
                <v-text-field
                  autofocus
                  v-model="formValues.title"
                  :rules="rules"
                  :label="$t('TaskForm.title')"
                  required
                  persistent-placeholder
                />
              </div>
              <div>
                <v-select
                  width="80"
                  :items="colors"
                  v-model="formValues.color"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :title="$t(`colors.${item.title}`)">
                      <template v-slot:prepend>
                        <v-list-item-action>
                          <v-badge inline :color="item.value"></v-badge>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item, index }">
                    <v-badge class="ml-n1 mr-2" inline :color="item.value"></v-badge>
                    <!-- {{ $te(item.title) ? $t(item.title) : item.title }} -->
                  </template>
                  <template v-slot:append-item>
                    <v-divider></v-divider>
                    <v-list-item ref="pickColorBtn" @click="" :title="$t('colors.pickColor')"></v-list-item>
                  </template>
                </v-select>
              </div>
            </div>
            <div v-if="!formValues.allDay">
              <div class="d-flex justify-space-between ga-2 mb-2">
                <!-- start -->
                <v-text-field
                  v-model="formValues.start"
                  required
                  :rules="dateRules"
                  :label="$t('TaskForm.start')"
                  :placeholder="getDatePattern"
                  persistent-placeholder
                >
                  <v-icon id="pr-1" class="order-2 cursor-pointer" size="x-small" color="black">mdi-calendar-blank</v-icon>
                  <v-menu
                    v-model="pickers.open[0]"
                    activator="#pr-1"
                    :close-on-content-click="false"
                    transition="scale-transition"
                  >
                    <v-date-picker
                      v-model="pickers.start"
                      elevation="5"
                      color="primary"
                      @update:model-value="formValues.start = pickers.start.toLocaleDateString(appLocale, {year: 'numeric', month: '2-digit', day: '2-digit'}); pickers.open[0] = false"
                    ></v-date-picker>
                  </v-menu>
                </v-text-field>
                <!-- start time -->
                <v-text-field
                  max-width="35%"
                  v-model="formValues.startTime"
                  :rules="[...timeRules, checkStartTimeValue]"
                  :label="$t('TaskForm.time')"
                  :placeholder="getTimePattern"
                  persistent-placeholder
                >
                  <v-icon id="pr-3" class="order-2 cursor-pointer" size="x-small" color="black">mdi-clock-outline</v-icon>
                  <v-menu
                    v-model="pickers.open[2]"
                    activator="#pr-3"
                    :close-on-content-click="false"
                    transition="scale-transition"
                  >
                    <v-time-picker
                      v-model="pickers.startTime"
                      @update:model-value="formValues.startTime = new Date(`1/1/1 ${pickers.startTime}`).toLocaleString(appLocale, {hour: '2-digit', minute: '2-digit'})"
                      @update:minute="pickers.open[2] = false"
                      :format="appLocale == 'en' ? 'ampm' : '24hr'"
                      :ampm-in-title="appLocale == 'en' ? true : false"
                      :max="checkDays(changeDateFormat(formValues.start), changeDateFormat(formValues.end)) ? pickers.endTime : null"
                      color="primary"
                      :title="$t('TaskForm.selectTime')"
                    ></v-time-picker>
                  </v-menu>
                </v-text-field>
              </div>
              <div class="d-flex justify-space-between ga-2">
                <!-- end -->
                <v-text-field
                  v-model="formValues.end"
                  required
                  :rules="dateRules"
                  :label="$t('TaskForm.end')"
                  :placeholder="getDatePattern"
                  persistent-placeholder
                >
                  <v-icon id="pr-2" class="order-2 cursor-pointer" size="x-small" color="black">mdi-calendar-blank</v-icon>
                  <v-menu
                    v-model="pickers.open[1]"
                    activator="#pr-2"
                    :close-on-content-click="false"
                    transition="scale-transition"
                  >
                    <v-date-picker
                      v-model="pickers.end"
                      elevation="5"
                      color="primary"
                      @update:model-value="formValues.end = pickers.end.toLocaleDateString(appLocale, {year: 'numeric', month: '2-digit', day: '2-digit'}); pickers.open[1] = false"
                    ></v-date-picker>
                  </v-menu>
                </v-text-field>
                <!-- end time -->
                <v-text-field
                  max-width="35%"
                  v-model="formValues.endTime"
                  :rules="[...timeRules, checkEndTimeValue]"
                  :label="$t('TaskForm.time')"
                  :placeholder="getTimePattern"
                  persistent-placeholder
                >
                  <v-icon id="pr-4" class="order-2 cursor-pointer" size="x-small" color="black">mdi-clock-outline</v-icon>
                  <v-menu
                    v-model="pickers.open[3]"
                    :close-on-content-click="false"
                    activator="#pr-4"
                    transition="scale-transition"
                  >
                    <v-time-picker
                      v-model="pickers.endTime"
                      @update:model-value="formValues.endTime = new Date(`1/1/1 ${pickers.endTime}`).toLocaleString(appLocale, {hour: '2-digit', minute: '2-digit'})"
                      @update:minute="pickers.open[3] = false"
                      :format="appLocale == 'en' ? 'ampm' : '24hr'"
                      :ampm-in-title="appLocale == 'en' ? true : false"
                      :min="checkDays(changeDateFormat(formValues.start), changeDateFormat(formValues.end)) ? pickers.startTime : null"
                      color="primary"
                      :title="$t('TaskForm.selectTime')"
                    ></v-time-picker>
                  </v-menu>
                </v-text-field>
              </div>
            </div>
            <div v-if="formValues.allDay">
              <!-- date -->
              <v-text-field
                width="100%"
                v-model="formValues.start"
                required
                :rules="allDayDateRules"
                :label="$t('TaskForm.date')"
                :placeholder="getDatePattern"
                persistent-placeholder
              >
                <v-icon id="pr-5" class="order-2 cursor-pointer" size="x-small" color="black">mdi-calendar-blank</v-icon>
                <v-menu
                  v-model="pickers.open[4]"
                  activator="#pr-5"
                  :close-on-content-click="false"
                  transition="scale-transition"
                >
                  <v-date-picker
                    v-model="pickers.start"
                    elevation="5"
                    @update:model-value="formValues.start = pickers.start.toLocaleDateString(appLocale, {year: 'numeric', month: '2-digit', day: '2-digit'}); pickers.open[4] = false"
                    color="primary"
                  ></v-date-picker>
                </v-menu>
              </v-text-field>
            </div>
            <div>
              <v-checkbox v-model="formValues.allDay" :label="$t('TaskForm.allDay')" hide-details class="mt-n1"></v-checkbox>
            </div>
          </v-form>
          <v-divider v-if="!taskFormEditing" class="mx-n6"></v-divider>
          <v-expansion-panels v-if="!taskFormEditing" class="mt-2">
            <v-expansion-panel
              elevation="0"
              static
            >
              <v-expansion-panel-title>{{ $t('TaskForm.reminders') }}</v-expansion-panel-title>
              <v-expansion-panel-text class="pa-0">
                <div>
                  <div class="d-flex justify-space-between ga-2 mb-2">
                    <v-btn
                      width="190"
                      height="40"
                      prepend-icon="mdi-bell-outline"
                      style="text-transform: none;"
                      variant="outlined"
                      color="primary"
                      @click="addReminder()"
                    >{{ $t('TaskForm.addReminder') }}</v-btn>
                    <v-select
                      width="140"
                      :items="allReminders"
                      v-model="reminder"
                      density="compact"
                      hide-details
                      placeholder="Choose time"
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" :title="$t(`reminders.${item.title}`)"></v-list-item>
                      </template>
                      <template v-slot:selection="{ item, index }"><span class="text-truncate">{{ $t(`reminders.${item.title}`) }}</span></template>
                    </v-select>
                  </div>
                  <div class="d-flex flex-wrap" style="gap: 4px 2px;">
                    <v-chip
                      v-for="(rem, index) in reminders"
                      :key="rem.id"
                      closable
                      @click:close="reminders.splice(index, 1)"
                    >{{ t(`reminders.${rem.title}`) }}</v-chip>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="!taskFormEditing"
            :text="$t('TaskForm.add')"
            @click="add(isActive)"
          ></v-btn>
          <v-btn
            v-else
            :text="$t('TaskForm.edit')"
            @click="edit(isActive)"
          ></v-btn>
          <v-btn
            :text="$t('TaskForm.cancel')"
            @click="isActive.value = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <!-- color pick dialog -->
  <v-dialog :activator="pickColorBtn" @afterLeave="pickers.color=''" max-width="332">
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-text class="pa-4">
          <v-color-picker v-model="pickers.color" hide-inputs></v-color-picker>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :text="$t('TaskForm.pick')"
            @click="pickColor(isActive)"
          ></v-btn>
          <v-btn
            :text="$t('TaskForm.close')"
            @click="isActive.value = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { calendarApi } from '@/scripts/calendar'
import { changeDateFormat, getDatePattern, getTimePattern, checkDays } from '@/scripts/dates'
import { appLocale, t } from '@/scripts/locale'
import { allReminders } from '@/scripts/reminders'

// reminders
const reminderId = ref(0)
function createReminderId() {
  reminderId.value++
  return reminderId.value
}
const reminder = ref()
const reminders = ref([])
function addReminder() {
  if(reminder.value) {
    Notification.requestPermission().then(permission => {
      if(permission === 'granted') {
        reminders.value.push({ id: createReminderId(), title: allReminders.value.find(v => v.value == reminder.value).title, value: reminder.value, done: false, })
      }
    })
  }
}
function resetRemindes() {
  reminderId.value = 0
  reminder.value = null
  reminders.value = []
}

import { taskFormOpen, taskFormEditing, formattedTask } from '@/scripts/form'
const taskForm = ref()
// form values
import { formValues } from '@/scripts/form'
// date pickers
const pickers = ref({
  start: null,
  end: null,
  open: [false, false, false, false, false],
  startTime: '',
  endTime: '',
  color: '',
})
// color picker
import { colors } from '@/scripts/settings'
const pickColorBtn = ref()
function pickColor(isActive) {
  if(pickers.value.color) {
    formValues.value.color = pickers.value.color
  }
  isActive.value = false
}
// validation
import { 
  rules, dateRules, timeRules, allDayDateRules,
  checkValue,
  compareStartEnd,
  compareStartTimeEndTime,
  checkStartTimeValue,
  checkEndTimeValue,
  checkValidDay,
  checkValidTime
} from '@/scripts/validation'

// watchers
watch(() => formValues.value.start, (newV, oldV) => {
  if(checkValidDay(newV) == true) {
    pickers.value.start = new Date(changeDateFormat(newV))
  }
  // validation
  if(taskForm.value && taskFormOpen.value && !formValues.value.allDay) {
    if(compareStartEnd() == true) {
      taskForm.value.items[2].validate()
      taskForm.value.items[4].validate()
      taskForm.value.items[3].validate()
      taskForm.value.items[5].validate()
    } else {
      taskForm.value.items[3].validate()
      taskForm.value.items[5].validate()
    }
  }
})
watch(() => formValues.value.end, (newV, oldV) => {
  if(checkValidDay(newV) == true) {
    pickers.value.end = new Date(changeDateFormat(newV))
  }
  // validation
  if(taskForm.value && taskFormOpen.value && !formValues.value.allDay) {
    if(compareStartEnd() == true) {
      taskForm.value.items[2].validate()
      taskForm.value.items[4].validate()
      taskForm.value.items[3].validate()
      taskForm.value.items[5].validate()
    } else {
      taskForm.value.items[3].validate()
      taskForm.value.items[5].validate()
    }
  }
  
})
watch(() => formValues.value.startTime, (newV, oldV) => {
  if(checkValidTime(newV) == true) {
    pickers.value.startTime = new Date(`1/1/1 ${newV}`).toLocaleString('ru', { hour: '2-digit', minute: '2-digit' })
  }
  if(newV == '' || newV == undefined || newV == null) {
    pickers.value.startTime = ''
  }
  // validation
  if(taskForm.value && taskFormOpen.value && !formValues.value.allDay) {
    if(compareStartTimeEndTime() == true) {
      taskForm.value.items[3].validate()
      taskForm.value.items[5].validate()
    }
  }
})
watch(() => formValues.value.endTime, (newV, oldV) => {
  if(checkValidTime(newV) == true) {
    pickers.value.endTime = new Date(`1/1/1 ${newV}`).toLocaleString('ru', { hour: '2-digit', minute: '2-digit' })
  }
  if(newV == '' || newV == undefined || newV == null) {
    pickers.value.endTime = ''
  }
  // validation
  if(taskForm.value && taskFormOpen.value && !formValues.value.allDay) {
    if(compareStartTimeEndTime() == true) {
      taskForm.value.items[3].validate()
      taskForm.value.items[5].validate()
    }
  }
})

// funcs
import { addTask, editTask } from '@/scripts/calendar'
import { taskInfoOpen, infoTask } from '@/scripts/info'

async function add(isActive) {
  const { valid } = await taskForm.value.validate()
  
  if(valid) {
    if(!formValues.value.allDay && !formValues.value.endTime && checkDays(changeDateFormat(formValues.value.start), changeDateFormat(formValues.value.end))) {
      formValues.value.endTime = '01:00'
    }

    let taskId = addTask(formattedTask.value, reminders.value)

    isActive.value = false
  }
}

async function edit(isActive) {
  const { valid } = await taskForm.value.validate()
  
  if(valid) {
    if(!formValues.value.allDay && !formValues.value.endTime && checkDays(changeDateFormat(formValues.value.start), changeDateFormat(formValues.value.end))) {
      formValues.value.endTime = '01:00'
    }

    editTask(infoTask.value.id, formattedTask.value)
    isActive.value = false
    taskInfoOpen.value = false
  }
}
</script>