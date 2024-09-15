<template>
  <v-dialog
    width="500"
    max-height="600"
    v-model="taskFormOpen"
    @afterLeave="taskForm.reset(); calendarApi.unselect(); resetReminders(); isEditingFromForm = false; taskFormEdited = false"
  >
    <template v-slot:default="{ isActive }">
      <v-card :title="!taskFormEditing ? $t('TaskForm.addTask') : $t('TaskForm.editTask')">
        <v-card-text class="pb-2">
          <!-- main -->
          <v-form ref="taskForm">
            <div class="flex gap-2">
              <div class="flex-grow">
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
              <div class="d-flex justify-space-between ga-2">
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
                      color="primary"
                      title="TaskForm.selectTime"
                    ></v-time-picker>
                    <!-- :max="checkDays(changeDateFormat(formValues.start), changeDateFormat(formValues.end)) ? (checkValidTime(pickers.endTime) ? pickers.endTime : null) : null" -->
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
                      color="primary"
                      title="TaskForm.selectTime"
                    ></v-time-picker>
                      <!-- :min="checkDays(changeDateFormat(formValues.start), changeDateFormat(formValues.end)) ? (checkValidTime(pickers.startTime) ? pickers.startTime : null) : null" -->
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
              <v-checkbox v-model="formValues.allDay" :label="$t('TaskForm.allDay')" hide-details></v-checkbox>
            </div>
          </v-form>
          <div class="flex h-[1px] bg-black opacity-[0.12] mx-n12"></div>
          <!-- additional -->
          <div class="mt-4">
            <!-- repeats -->
            <div>
              <div class="flex gap-1">
                <div class="w-10 h-10 p-[10px]">
                  <v-icon size="small" class="mb-2">mdi-refresh</v-icon>
                </div>
                <div class="flex-grow flex flex-col items-start">
                  <v-hover>
                    <template v-slot:default="{ isHovering, props }">
                      <v-select
                        v-bind="props"
                        :items="repeats"
                        v-model="repeat"
                        density="compact"
                        variant="solo"
                        flat
                        :bg-color="isHovering ? '#f6f6f6' : 'white'"
                        v-ripple="{ class: 'rounded' }"
                        hide-details
                      >
                      </v-select>
                    </template>
                  </v-hover>
                </div>
              </div>
            </div>
            <!-- reminders -->
            <div class="flex flex-col gap-1">
              <div class="flex gap-1">
                <div class="w-10 h-10 p-[10px]">
                  <v-icon size="small" class="mb-2">mdi-bell-outline</v-icon>
                </div>
                <div class="flex-grow">
                  <v-btn
                    height="40"
                    variant="text"
                    @click="addReminder()"
                  ><span class="text-base font-normal tracking-normal normal-case text-[#000000de]">{{ $t('TaskForm.addReminder') }}</span></v-btn>
                </div>
              </div>
              <div class="flex gap-1">
                <div class="w-10">
                  <div class="w-5"></div>
                </div>
                <div class="flex-grow flex flex-col items-start">
                  <template v-for="(rem, index) in reminders" :key="rem.id">
                    <v-hover>
                      <template v-slot:default="{ isHovering, props }">
                        <v-chip
                          v-bind="props"
                          label
                          variant="text"
                          @click=""
                          class="pl-0"
                          close-icon="mdi-close"
                          :closable="isHovering"
                          @click:close="reminders.splice(index, 1)"
                        >
                          <v-select
                            :items="allReminders"
                            v-model="reminders.find(v => v.id == rem.id).value"
                            @update:modelValue="value => reminders.find(v => v.id == rem.id).title = allReminders.find(v => v.value == value).title"
                            density="compact"
                            variant="solo"
                            flat
                            bg-color="transparent"
                            class="reminder-select"
                            hide-details
                          >
                            <template v-slot:item="{ props, item }">
                              <v-list-item v-bind="props" :title="$t(`reminders.${item.title}`)"></v-list-item>
                            </template>
                            <template v-slot:selection="{ item, index }">
                              <span class="text-[15px] text-grey-darken-3 mr-n1">{{ $t(`reminders.${item.title}`) }}</span>
                            </template>
                          </v-select>
                        </v-chip>
                      </template>
                    </v-hover>
                  </template>
                </div>
              </div>
            </div>
          </div>
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
import { isEditingFromForm, reminderId, reminders, taskFormEdited } from '@/scripts/form'

// reminders
function createReminderId() {
  reminderId.value++
  return reminderId.value
}
function addReminder() {
  reminders.value.push({ id: createReminderId(), title: allReminders[3].title, value: allReminders[3].value, done: false, })
}
function resetReminders() {
  reminderId.value = 0
  reminders.value = []
}
// repeats
const repeat = ref(repeats[0])

import { taskFormOpen, taskFormEditing, formattedTask, repeats } from '@/scripts/form'
const taskForm = ref()
// form values
import { formValues } from '@/scripts/form'
// pickers
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
import { notify, refreshNotifications } from '~/scripts/notification'

async function add(isActive) {
  const { valid } = await taskForm.value.validate()
  
  if(valid) {
    if(!formValues.value.allDay && !formValues.value.endTime && checkDays(changeDateFormat(formValues.value.start), changeDateFormat(formValues.value.end))) {
      formValues.value.endTime = '01:00'
    }

    // done
    if(reminders.value.length > 0) {
      for(const reminder of reminders.value) {
        let time = new Date(formattedTask.value.start.getTime() - reminder.value)
        let isFuture = time.getTime() >= Date.now()
        reminder.done = !isFuture
      }
    }

    let taskId = addTask(formattedTask.value, reminders.value)

    // send notification
    if(reminders.value.length > 0) {
      for(const reminder of reminders.value) {
        let time = new Date(formattedTask.value.start.getTime() - reminder.value)
        let isFuture = time.getTime() >= Date.now()

        if(isFuture) {
          notify(
            {
              title: formValues.value.title,
              body: `${formattedTask.value.start} - ${formattedTask.value.end}`
            },
            time,
            {
              taskId: taskId,
              reminderId: reminder.id,
            },
          )
        }
      }
    }

    isActive.value = false
  }
}

async function edit(isActive) {
  const { valid } = await taskForm.value.validate()

  if(valid) {
    if(!formValues.value.allDay && !formValues.value.endTime && checkDays(changeDateFormat(formValues.value.start), changeDateFormat(formValues.value.end))) {
      formValues.value.endTime = '01:00'
    }

    // done
    if(reminders.value.length > 0) {
      for(const reminder of reminders.value) {
        let time = new Date(formattedTask.value.start.getTime() - reminder.value)
        let isFuture = time.getTime() >= Date.now()
        reminder.done = !isFuture        
      }
    }

    editTask(formattedTask.value, reminders.value)

    // resend
    if(taskFormEdited.value && reminders.value.length > 0) {
      const notifications = []

      for(const reminder of reminders.value) {
        let time = new Date(formattedTask.value.start.getTime() - reminder.value)
        let isFuture = time.getTime() >= Date.now()
        
        if(isFuture) {
          
          notifications.push({
            notification: {
              title: formattedTask.value.title,
              body: `${formattedTask.value.start} - ${formattedTask.value.end}`,
            },
            time: time,
            ids: {
              taskId: Number.parseInt(infoTask.value.id),
              reminderId: reminder.id,
            }
          })
        }
      }

      refreshNotifications(infoTask.value.id, notifications)
    }

    isActive.value = false
    taskInfoOpen.value = false
  }
}
</script>

<style>
.reminder-select .v-field--appended {
  padding-inline-end: 0px;
}
</style>