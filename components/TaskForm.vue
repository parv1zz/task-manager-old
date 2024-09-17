<template>
  <v-dialog
    width="500"
    max-height="600"
    v-model="taskFormOpen"
    @afterLeave="resetForm"
  >
    <template v-slot:default="{ isActive }">
      <v-card :title="!taskFormEditing ? $t('TaskForm.addTask') : $t('TaskForm.editTask')">
        <v-card-text class="pb-2">
          <!-- main -->
          <v-form ref="taskForm" validate-on="submit">
            <div class="flex gap-2">
              <v-text-field
                autofocus
                v-model="formValues.title"
                :rules="rules"
                :label="$t('TaskForm.title')"
                required
                persistent-placeholder
              />
              <v-select
                max-width="80"
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
                  <Divider />
                  <v-list-item ref="pickColorBtn" @click="" :title="$t('colors.pickColor')"></v-list-item>
                </template>
              </v-select>
            </div>
            <div>
              <div class="flex gap-2">
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
                  v-if="!formValues.allDay"
                  max-width="26.1%"
                  v-model="formValues.startTime"
                  :rules="[...timeRules, checkStartTimeValue]"
                  :label="$t('TaskForm.time')"
                  :placeholder="getTimePattern"
                  persistent-placeholder
                  @update:focused="formValues.filterValue = formValues.startTime"
                >
                  <v-menu activator="parent" height="auto" max-height="200" v-if="timesEnFiltered.length > 0">
                    <v-list>
                      <v-list-item
                        v-for="(item, index) in (appLocale == 'en' ? timesEnFiltered : timesRuFiltered)"
                        :key="index"
                        :value="index"
                        @click="formValues.startTime = item"
                      >
                        <v-list-item-title>{{ item }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-text-field>
              </div>
              <div class="flex gap-2">
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
                  v-if="!formValues.allDay"
                  max-width="26.1%"
                  v-model="formValues.endTime"
                  :rules="[...timeRules, checkEndTimeValue]"
                  :label="$t('TaskForm.time')"
                  :placeholder="getTimePattern"
                  persistent-placeholder
                  @update:focused="formValues.filterValue = formValues.endTime"
                >
                  <v-menu activator="parent" height="auto" max-height="200" v-if="timesEnFiltered.length > 0">
                    <v-list>
                      <v-list-item
                        v-for="(item, index) in (appLocale == 'en' ? timesEnFiltered : timesRuFiltered)"
                        :key="index"
                        :value="index"
                        @click="formValues.endTime = item"
                      >
                        <v-list-item-title>{{ item }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-text-field>
              </div>
            </div>
            <!-- all day -->
            <div>
              <v-checkbox v-model="formValues.allDay" :label="$t('TaskForm.allDay')" hide-details></v-checkbox>
            </div>
          </v-form>

          <!-- divider -->
          <Divider class="mx-n12" />

          <!-- additional -->
          <div class="mt-4">
            <!-- repeats -->
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
        <!-- btns -->
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
function resetForm() {
  // form
  taskForm.value.reset()
  resetReminders()
  formValues.value.startTime = ''
  formValues.value.endTime = ''

  // calendar
  calendarApi.unselect()
  // editing
  isEditingFromForm.value = false
  taskFormEdited.value = false
}

import { calendarApi, notificationBody } from '@/scripts/calendar'
import { changeDateFormat, getDatePattern, getTimePattern, checkDays, timesEnFiltered, timesRuFiltered } from '@/scripts/dates'
import { appLocale, t } from '@/scripts/locale'
import { allReminders, arraysEqual } from '@/scripts/reminders'
import { formValues, taskFormOpen, taskFormEditing, formattedTask, repeats, isEditingFromForm, reminderId, reminders, taskFormEdited, repeat } from '@/scripts/form'

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

// form
const taskForm = ref()
// pickers
const pickers = ref({
  start: null,
  end: null,
  open: [false, false, false],
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
// watch(() => formValues.value.start, (newV, oldV) => {
//   validation
//   if(taskForm.value && taskFormOpen.value && !formValues.value.allDay) {
//     if(compareStartEnd()) {
//       taskForm.value.items[2].validate()
//       taskForm.value.items[4].validate()
//     }
//     taskForm.value.items[3].validate()
//     taskForm.value.items[5].validate()
//   }
//   if(taskForm.value && taskFormOpen.value && formValues.value.allDay) {
//     taskForm.value.items[2].validate()
//     taskForm.value.items[3].validate()
//   }
// })
// watch(() => formValues.value.end, (newV, oldV) => {
//   validation
//   if(taskForm.value && taskFormOpen.value && !formValues.value.allDay) {
//     if(compareStartEnd()) {
//       taskForm.value.items[2].validate()
//       taskForm.value.items[4].validate()
//     }
//     taskForm.value.items[3].validate()
//     taskForm.value.items[5].validate()
//   }
//   if(taskForm.value && taskFormOpen.value && formValues.value.allDay) {
//     taskForm.value.items[2].validate()
//     taskForm.value.items[3].validate()
//   }
// })
watch(() => formValues.value.startTime, (newV, oldV) => {
  formValues.value.filterValue = newV
  // validation
  // if(taskForm.value && taskFormOpen.value && !formValues.value.allDay) {
  //   if(compareStartTimeEndTime()) {
  //     taskForm.value.items[3].validate()
  //     taskForm.value.items[5].validate()
  //   }
  // }
})
watch(() => formValues.value.endTime, (newV, oldV) => {
  formValues.value.filterValue = newV
  // validation
  // if(taskForm.value && taskFormOpen.value && !formValues.value.allDay) {
  //   if(compareStartTimeEndTime()) {
  //     taskForm.value.items[3].validate()
  //     taskForm.value.items[5].validate()
  //   }
  // }
})

// funcs
import { addTask, editTask } from '@/scripts/calendar'
import { taskInfoOpen, infoTask } from '@/scripts/info'
import { notify, refreshNotifications } from '~/scripts/notification'
import { snackbars, snackbarTimeout } from '~/scripts/snackbars'

async function add(isActive) {
  const { valid } = await taskForm.value.validate()
  
  if(valid) {
    // done
    if(reminders.value.length > 0) {
      for(const reminder of reminders.value) {
        let time = new Date(formattedTask.value.start.getTime() - reminder.value)
        let isFuture = time.getTime() >= Date.now()
        reminder.done = !isFuture
      }
    }

    if(formValues.value.allDay) {
      // allday issue
      formValues.value.end = new Date(new Date(formValues.value.end).getTime()+1*24*3600*1000).toLocaleDateString(appLocale.value, { year: 'numeric', month: 'numeric', day: 'numeric' })
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
              body: notificationBody(formattedTask.value),
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

    // snackbar
    snackbars.value[2].open = false
    snackbars.value[2].open = true
    snackbars.value[2].title = formValues.value.title
    snackbars.value[2].text = 'added'

    // close
    isActive.value = false
  }
}

async function edit(isActive) {
  const { valid } = await taskForm.value.validate()

  if(valid) {
    // done
    if(reminders.value.length > 0) {
      for(const reminder of reminders.value) {
        let time = new Date(formattedTask.value.start.getTime() - reminder.value)
        let isFuture = time.getTime() >= Date.now()
        reminder.done = !isFuture        
      }
    }

    if(formValues.value.allDay) {
      // allday issue 
      formValues.value.end = new Date(new Date(formValues.value.end).getTime()+1*24*3600*1000).toLocaleDateString(appLocale.value, { year: 'numeric', month: 'numeric', day: 'numeric' })
    }
    editTask(formattedTask.value, reminders.value)

    // resend
    if(taskFormEdited.value) {
      const notifications = []

      for(const reminder of reminders.value) {
        let time = new Date(formattedTask.value.start.getTime() - reminder.value)
        let isFuture = time.getTime() >= Date.now()
        
        if(isFuture) {
          notifications.push({
            notification: {
              title: formattedTask.value.title,
              body: notificationBody(formattedTask.value),
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

    if(reminders.value.length > 0 && (formattedTask.value.start.getTime() != infoTask.value.start.getTime() || !arraysEqual(infoTask.value.extendedProps.reminders, reminders.value))) {
      let title = formattedTask.value.title

      setTimeout(() => {
        snackbars.value[4].open = false
        snackbars.value[4].open = true
        snackbars.value[4].title = title
      }, snackbarTimeout.value)
    }

    // close
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