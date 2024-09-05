<template>
  <div>
    <!-- <v-btn @click="console.log(calendar.$vuetify.locale.current)">a</v-btn> -->
    <!-- app wrapper -->
    <div>
      <!-- app header -->
      <div class="bg-grey-lighten-3">
        <Container>
          <div class="d-flex justify-space-between align-center">
            <!-- lang select -->
            <div>
              <v-select
                width="100"
                :items="locales"
                v-model="appLocale"
                density="compact"
                variant="outlined"
                hide-details
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :title="item.title">
                    <template v-slot:prepend>
                      <v-list-item-action>
                        <img v-if="item.title == 'en'" width="25" src="https://humresdb.com/languages/imgList/en.svg" />
                        <img v-if="item.title == 'ru'" width="25" src="https://humresdb.com/languages/imgList/ru.svg" />
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ item, index }">
                  <img class="ml-n1" v-if="item.title == 'en'" width="25" src="https://humresdb.com/languages/imgList/en.svg" />
                  <img class="ml-n1" v-if="item.title == 'ru'" width="25" src="https://humresdb.com/languages/imgList/ru.svg" />
                  <div class="ml-2">{{ item.title }}</div>
                </template>
              </v-select>
            </div>
            <!-- settings btn -->
            <v-btn variant="text" icon="mdi-cog"></v-btn>
          </div>
        </Container>
      </div>

      <!-- calendar -->
      <div class="w-100">
        <!-- header toolbar -->
        <!-- if large -->
        <div v-if="!smAndDown" class="d-flex justify-space-between flex-row my-4">
          <div id="date-controls">
              <v-btn
                icon="mdi-chevron-left"
                :size="xs ? 'x-small' : 'small'"
                variant="outlined"
                color="#2c3e50"
                @click="calendarApi.prev()"
              ></v-btn>
              <v-btn
                :size="xs ? 'x-small' : 'small'"
                icon="mdi-chevron-right"
                variant="outlined"
                class="ml-1"
                color="#2c3e50"
                @click="calendarApi.next()"
              ></v-btn>
              <v-btn
                id="today-btn"
                :width="smAndDown ? '32%' : ''"
                height="40"
                color="#2c3e50"
                elevation="0"
                class="ml-3"
                slim
                @click="calendarApi.today()"
              >{{ $t('today') }}</v-btn>
          </div>
          <div id="today-title">today</div>
          <div id="date-btns" class="d-flex" :class="xs ? 'ga-2' : 'ga-3'">
            <v-select
              :width="smAndDown ? '32%' : (xs ? '50%' : '')"
              :items="calendarViewModes"
              v-model="calendarViewMode"
              density="compact"
              variant="outlined"
              hide-details
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="$t(item.title)">
                  <template v-slot:prepend>
                    <v-list-item-action>
                      <v-icon v-if="item.title == 'month'" icon="mdi-calendar-month"></v-icon>
                      <v-icon v-if="item.title == 'week'" icon="mdi-calendar-week"></v-icon>
                      <v-icon v-if="item.title == 'day'" icon="mdi-calendar-today"></v-icon>
                      <v-icon v-if="item.title == 'list'" icon="mdi-list-box-outline"></v-icon>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </template>
              <template v-slot:selection="{ item, index }">
                <v-icon v-if="item.title == 'month'" icon="mdi-calendar-month"></v-icon>
                <v-icon v-if="item.title == 'week'" icon="mdi-calendar-week"></v-icon>
                <v-icon v-if="item.title == 'day'" icon="mdi-calendar-today"></v-icon>
                <v-icon v-if="item.title == 'list'" icon="mdi-list-box-outline"></v-icon>
                <div v-if="!xs" class="ml-3">{{ $t(item.title) }}</div>
              </template>
            </v-select>
            <v-btn
              :width="smAndDown ? '32%' : (xs ? '50%' : '')"
              :size="xs ? 'x-small' : 'default'"
              height="40"
              color="#2c3e50"
              elevation="0"
              slim
              prepend-icon="mdi-plus"
              @click="addTaskClick"
            >{{ !xs ? $t('addTask') : '' }}</v-btn>
          </div>
        </div>
        <!-- if small -->
        <div v-if="smAndDown" class="d-flex justify-space-between flex-column my-4">
          <div id="date-controls" class="d-flex">
            <v-btn
              icon="mdi-chevron-left"
              :size="xs ? 'x-small' : 'small'"
              variant="outlined"
              color="#2c3e50"
              @click="calendar.getApi().prev()"
            ></v-btn>
            <v-btn
              :size="xs ? 'x-small' : 'small'"
              icon="mdi-chevron-right"
              variant="outlined"
              class="ml-1"
              color="#2c3e50"
              @click="calendar.getApi().next()"
            ></v-btn>
            <div id="today-title">today</div>
          </div>
          <div id="date-btns" class="d-flex" :class="xs ? 'ga-2' : 'ga-3'">
            <v-btn
              id="today-btn"
              :width="smAndDown ? '32%' : ''"
              height="40"
              color="#2c3e50"
              elevation="0"
              class="ml-3"
              slim
              @click="calendar.getApi().today()"
            >{{ $t('today') }}</v-btn>
            <v-select
              :width="smAndDown ? '32%' : (xs ? '50%' : '')"
              :items="calendarViewModes"
              v-model="calendarViewMode"
              density="compact"
              variant="outlined"
              hide-details
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="$t(item.title)">
                  <template v-slot:prepend>
                    <v-list-item-action>
                      <v-icon v-if="item.title == 'month'" icon="mdi-calendar-month"></v-icon>
                      <v-icon v-if="item.title == 'week'" icon="mdi-calendar-week"></v-icon>
                      <v-icon v-if="item.title == 'day'" icon="mdi-calendar-today"></v-icon>
                      <v-icon v-if="item.title == 'list'" icon="mdi-list-box-outline"></v-icon>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </template>
              <template v-slot:selection="{ item, index }">
                <v-icon v-if="item.title == 'month'" icon="mdi-calendar-month"></v-icon>
                <v-icon v-if="item.title == 'week'" icon="mdi-calendar-week"></v-icon>
                <v-icon v-if="item.title == 'day'" icon="mdi-calendar-today"></v-icon>
                <v-icon v-if="item.title == 'list'" icon="mdi-list-box-outline"></v-icon>
                <div v-if="!xs" class="ml-3">{{ $t(item.title) }}</div>
              </template>
            </v-select>
            <v-btn
              :width="smAndDown ? '32%' : (xs ? '50%' : '')"
              :size="xs ? 'x-small' : 'default'"
              height="40"
              color="#2c3e50"
              elevation="0"
              slim
              prepend-icon="mdi-plus"
              @click="addTaskClick"
            >{{ !xs ? $t('addTask') : '' }}</v-btn>
          </div>
        </div>
        <!-- calendar tasks -->
        <FullCalendar
          ref="calendar"
          :options="calendarOptions"
        >
          <!-- task -->
          <template v-slot:eventContent="arg">
            <div v-if="!arg.event.allDay" class="overflow-hidden"> 
              <div v-if="checkDays(arg.event.start, arg.event.end) && arg.view.type == 'dayGridMonth'">
                <v-badge inline dot :color="arg.event.backgroundColor"></v-badge>
                <span class="mr-1" v-if="!smAndDown">{{ arg.timeText }}</span>
                <b>{{ arg.event.title }}</b>
              </div>
              <div class="pl-1" v-if="!checkDays(arg.event.start, arg.event.end) && arg.view.type == 'dayGridMonth'">
                <b class="mr-1" v-if="!smAndDown">{{ arg.timeText }}</b>
                <span>{{ arg.event.title }}</span>
              </div>

              <div class="pl-1" v-if="arg.view.type !== 'dayGridMonth'">
                <b>{{ arg.event.title }}</b><br>
                <span v-if="!xs" class="text-12">{{ arg.timeText }}</span>
              </div>
            </div>
            <div v-else class="pl-1">{{ arg.event.title }}</div>
          </template>
          <!-- day headers -->
          <template v-slot:dayHeaderContent="arg">
            <!-- week -->
            <div v-if="calendarViewMode == 'timeGridWeek'">
              <div v-if="appLocale == 'ru'">
                {{ arg.text.split(' ')[0].replace(',', '') }}<br />
                {{ arg.text.split(' ')[1] }}
              </div>
              <div v-if="appLocale == 'en'">
                {{ arg.text.split(' ')[1] }}<br />
                {{ arg.text.split(' ')[0] }}<br />
              </div>
            </div>
            <!-- list -->
            <div v-if="calendarViewMode == 'listMonth'" class="d-flex justify-space-between">
              <span>
                {{ calendarViewMode == 'listMonth' ? `${arg.text}` : '' }}
              </span>
              <span>
                {{ new Date(arg.date).toLocaleDateString(appLocale, { weekday: 'long' }) }}
              </span>
            </div>
            <!-- others -->
            <div v-if="calendarViewMode !== 'timeGridWeek' && calendarViewMode !== 'listMonth'">
              {{ arg.text }}
            </div>
          </template>
        </FullCalendar>
      </div>
    </div>

    <!-- task form dialog -->
    <v-dialog
      :fullscreen="w660"
      v-model="taskFormOpen"
      @afterLeave="taskForm.reset()"
      :max-width="!w660 ? '600' : ''"
    >
      <template v-slot:default="{ isActive }">
        <v-card :title="!taskFormEditing ? $t('addTask') : $t('editTask')">
          <v-card-text class="pb-0">
            <v-form ref="taskForm">
              <v-container class="pa-0">
                <v-row>
                  <v-col :class="w660 ? 'pr-1' : ''">
                    <v-text-field
                      autofocus
                      v-model="formValues.title"
                      :rules="rules"
                      :label="$t('title')"
                      required
                      persistent-placeholder
                    />
                  </v-col>
                  <v-col :class="w660 ? 'pl-1' : ''">
                    <v-select
                      v-model="formValues.color"
                      :items="colors"
                      :label="$t('color')"
                      persistent-placeholder
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" :title="$t(item.title)">
                          <template v-slot:prepend>
                            <v-list-item-action>
                              <v-badge inline :color="item.value"></v-badge>
                            </v-list-item-action>
                          </template>
                        </v-list-item>
                      </template>
                      <template v-slot:selection="{ item, index }">
                        <v-badge class="ml-n1 mr-2" inline :color="item.value"></v-badge>
                        {{ !xs ? ($te(item.title) ? $t(item.title) : item.title) : '' }}
                      </template>
                      <template v-slot:append-item>
                        <v-divider></v-divider>
                        <v-list-item ref="pickColorBtn" @click="" :title="$t('pickColor')"></v-list-item>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                <v-row v-if="!formValues.allDay" :class="w660 ? 'flex-column' : ''">
                  <v-col class="pt-0 d-flex justify-space-between ga-2" :class="w660 ? 'w-100' : 'w-50'">
                    <!-- start -->
                    <v-text-field
                      width="156"
                      v-model="formValues.start"
                      required
                      :rules="dateRules"
                      :label="$t('start')"
                      :placeholder="getDatePattern()"
                      persistent-placeholder
                    >
                      <v-icon id="pr-1" class="order-2 cursor-pointer" size="x-small" color="black">mdi-calendar-blank</v-icon>
                      <v-menu
                        v-model="pickerOpen[0]"
                        activator="#pr-1"
                        :close-on-content-click="false"
                        transition="scale-transition"
                      >
                        <v-date-picker
                          v-model="pickerStart"
                          elevation="5"
                          @update:model-value="formValues.start = pickerStart.toLocaleDateString(appLocale, {year: 'numeric', month: '2-digit', day: '2-digit'}); pickerOpen[0] = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-text-field>
                    <!-- start time -->
                    <v-text-field
                      :width="appLocale == 'en' ? '141' : '110'"
                      v-model="formValues.startTime"
                      :rules="[...timeRules, checkStartTimeValue]"
                      :label="$t('time')"
                      :placeholder="getTimePattern()"
                      persistent-placeholder
                    >
                      <v-icon id="pr-3" class="order-2 cursor-pointer" size="x-small" color="black">mdi-clock-outline</v-icon>
                      <v-menu
                        v-model="pickerOpen[2]"
                        activator="#pr-3"
                        :close-on-content-click="false"
                        transition="scale-transition"
                      >
                        <v-time-picker
                          v-model="pickerStartTime"
                          @update:model-value="formValues.startTime = new Date(`1/1/1 ${pickerStartTime}`).toLocaleString(appLocale, {hour: '2-digit', minute: '2-digit'})"
                          @update:minute="pickerOpen[2] = false"
                          :format="appLocale == 'en' ? 'ampm' : '24hr'"
                          :ampm-in-title="appLocale == 'en' ? true : false"
                          :max="pickerEndTime"
                          :title="$t('selectTime')"
                        ></v-time-picker>
                      </v-menu>
                    </v-text-field>
                  </v-col>
                  <v-col class="pt-0 d-flex justify-space-between ga-2" :class="w660 ? 'w-100' : 'w-50'">
                    <!-- end -->
                    <v-text-field
                      width="156"
                      v-model="formValues.end"
                      required
                      :rules="dateRules"
                      :label="$t('end')"
                      :placeholder="getDatePattern()"
                      persistent-placeholder
                    >
                      <v-icon id="pr-2" class="order-2 cursor-pointer" size="x-small" color="black">mdi-calendar-blank</v-icon>
                      <v-menu
                        v-model="pickerOpen[1]"
                        activator="#pr-2"
                        :close-on-content-click="false"
                        transition="scale-transition"
                      >
                        <v-date-picker
                          v-model="pickerEnd"
                          elevation="5"
                          @update:model-value="formValues.end = pickerEnd.toLocaleDateString(appLocale, {year: 'numeric', month: '2-digit', day: '2-digit'}); pickerOpen[1] = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-text-field>
                    <!-- end time -->
                    <v-text-field
                      :width="appLocale == 'en' ? '141' : '110'"
                      v-model="formValues.endTime"
                      :rules="[...timeRules, checkEndTimeValue]"
                      :label="$t('time')"
                      :placeholder="getTimePattern()"
                      persistent-placeholder
                    >
                      <v-icon id="pr-4" class="order-2 cursor-pointer" size="x-small" color="black">mdi-clock-outline</v-icon>
                      <v-menu
                        v-model="pickerOpen[3]"
                        :close-on-content-click="false"
                        activator="#pr-4"
                        transition="scale-transition"
                      >
                        <v-time-picker
                          v-model="pickerEndTime"
                          @update:model-value="formValues.endTime = new Date(`1/1/1 ${pickerEndTime}`).toLocaleString(appLocale, {hour: '2-digit', minute: '2-digit'})"
                          @update:minute="pickerOpen[3] = false"
                          :format="appLocale == 'en' ? 'ampm' : '24hr'"
                          :ampm-in-title="appLocale == 'en' ? true : false"
                          :min="pickerStartTime"
                          :title="$t('selectTime')"
                        ></v-time-picker>
                      </v-menu>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row v-if="formValues.allDay">
                  <v-col class="pt-0">
                    <!-- date -->
                    <v-text-field
                      width="100%"
                      v-model="formValues.start"
                      required
                      :rules="allDayDateRules"
                      :label="$t('start')"
                      :placeholder="getDatePattern()"
                      persistent-placeholder
                    >
                      <v-icon id="pr-5" class="order-2 cursor-pointer" size="x-small" color="black">mdi-calendar-blank</v-icon>
                      <v-menu
                        v-model="pickerOpen[4]"
                        activator="#pr-5"
                        :close-on-content-click="false"
                        transition="scale-transition"
                      >
                        <v-date-picker
                          v-model="pickerStart"
                          elevation="5"
                          @update:model-value="formValues.start = pickerStart.toLocaleDateString(appLocale, {year: 'numeric', month: '2-digit', day: '2-digit'}); pickerOpen[4] = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
              <v-checkbox v-model="formValues.allDay" :label="$t('allDay')" hide-details></v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="!taskFormEditing"
              :text="$t('add')"
              @click="addTask(isActive)"
              color="green"
            ></v-btn>
            <v-btn
              v-else
              :text="$t('edit')"
              @click="editTask(isActive)"
              color="green"
            ></v-btn>
            <v-btn
              v-if="!taskFormEditing"
              :text="$t('cancel')"
              @click="closeAddTask(isActive)"
              color="red"
            ></v-btn>
            <v-btn
              v-else
              :text="$t('cancel')"
              @click="closeEditTask(isActive)"
              color="red"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <!-- info dialog -->
    <v-dialog v-model="taskInfoOpen" @afterLeave="currentTask = {}" v-if="!currentTask.hasOwnProperty('title')" max-width="400">
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title>{{ $t('taskInfo') }}</v-card-title>
          <v-card-subtitle v-if="currentTask.allDay">{{ $t('allDay') }}</v-card-subtitle>
          <v-card-text>
            <div class="d-flex align-center ga-2">
              <v-badge class="mx-n1" inline :color="currentTask.backgroundColor"></v-badge>
              <h3 style="font-size: 20px;">{{ currentTask.title }}</h3>
            </div>
            <div v-if="currentTask.allDay" class="mt-2 text-body-2">{{ currentTask.start.toLocaleString(appLocale, {day: 'numeric', month: 'short', year: 'numeric'}) }}</div>
            <div>
              <div v-if="(!currentTask.allDay && checkDays(currentTask.start, currentTask.end))" class="mt-2 text-body-2">
                <span>{{ currentTask.start.toLocaleString(appLocale, {day: 'numeric', month: 'short', year: 'numeric'}) }} • </span>
                <span class="font-weight-bold">{{ currentTask.start.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' ? true : false }) }}</span>
                <span> - </span>
                <span class="font-weight-bold">{{ currentTask.end.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' ? true : false }) }}</span>
                <span class="text-body-2" v-if="!currentTask.allDay"> ({{ getDatesDuration(currentTask.start, currentTask.end) }})</span>
              </div>
              <div v-if="(!currentTask.allDay && !checkDays(currentTask.start, currentTask.end))" class="mt-2 text-body-2">
                <span>{{ currentTask.start.toLocaleString(appLocale, {day: 'numeric', month: 'short', year: 'numeric'}) }}</span>
                <span class="font-weight-bold">{{ ' ' + currentTask.start.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' ? true : false }) }}</span>
                <span> - {{ currentTask.end.toLocaleString(appLocale, {day: 'numeric', month: 'short', year: 'numeric'}) }}</span>
                <span class="font-weight-bold">{{ ' ' + currentTask.end.toLocaleString(appLocale, { hour: 'numeric', minute: 'numeric', hour12: appLocale == 'en' ? true : false }) }}</span>
                <div class="text-body-2" v-if="!currentTask.allDay"> ({{ getDatesDuration(currentTask.start, currentTask.end) }})</div>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn icon="mdi-pencil" @click="editTaskClick"></v-btn>
            <v-btn icon="mdi-delete" @click="deleteTask(isActive)" color="red"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <!-- color pick dialog -->
    <v-dialog :activator="pickColorBtn" @afterLeave="pickerColor=''" max-width="332">
      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-text class="pa-4">
            <v-color-picker v-model="pickerColor" hide-inputs></v-color-picker>
          </v-card-text>
          <v-card-actions>            
            <v-btn
              :text="$t('pick')"
              @click="pickColor(isActive)"
            ></v-btn>
            <v-btn
              :text="$t('close')"
              @click="isActive.value = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script setup>
// date funcs
import { changeDateFormat, checkDays, getDatesDuration, getDatePattern, getTimePattern } from '@/scripts/dates'

// responsive
import { useDisplay } from 'vuetify'
const { xs, sm, width, smAndDown, mdAndUp } = useDisplay()

const w660 = computed({
  get() {
    return width.value < 660
  }
})
watch(w660, (n, o) => {
  if(n) {
    calendarApi.setOption('weekNumbers', false)
  } else {
    calendarApi.setOption('weekNumbers', true)
  }
})

// app locale
import { appLocale } from '@/scripts/locale'
const locales = ref(['en', 'ru'])
watch(appLocale, async (n, o) => {
  changeLocale(n)
})

// i18n
const { locale, setLocale } = useI18n()
// vuetify locale
import { useLocale } from 'vuetify'
const { current } = useLocale()
// change func
function changeLocale(locale) {
  setLocale(locale)

  current.value = locale

  calendarApi.setOption('locale', locale)
  calendarApi.setOption('firstDay', locale == 'en' ? 0 : 1)
  calendarApi.changeView(calendarViewMode.value)
  
  localStorage.setItem('locale', locale)
}

// head
useHead({
  title: 'Task manager',
})

// calendar imports
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import allLocales from '@fullcalendar/core/locales-all'

// calendar tasks
const calendarTasks = ref([])
const taskId = ref()
function createTaskId() {
  taskId.value++
  localStorage.setItem('id', JSON.stringify(taskId.value))
  return String(taskId.value)
}
// calendar
const calendar = ref()
let calendarApi

// calendar settings
const calendarOptions = ref({
  // settings
  plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin ],
  initialView: 'dayGridMonth',
  events: calendarTasks.value,

  // date settings
  nowIndicator: true,
  dayMaxEvents: true,
  firstDay: appLocale.value == 'en' ? 0 : 1,
  snapDuration: '00:10:00',
  fixedWeekCount: false,
  weekNumbers: !w660.value ? true : false,
  views: {
    week: {
      dayHeaderFormat: { weekday: 'short', day: 'numeric' },
    }
  },

  // mobile
  longPressDelay: 250,
  eventLongPressDelay: 250,
  selectLongPressDelay: 250,
  
  // other
  height: '100vh',
  locales: allLocales,
  locale: appLocale.value,

  // header
  headerToolbar: false,

  // editable
  editable: true,
  eventsSet: updateTasks,
  // navs
  navLinks: true,
  navLinkDayClick: function(date, jsEvent) {
    calendarApi.gotoDate(date)

    calendarViewMode.value = 'timeGridDay'
  },
  navLinkWeekClick: function(weekStart) {
    calendarApi.gotoDate(weekStart)

    calendarViewMode.value = 'timeGridWeek'
  },
  // 
  eventClick: showTaskInfo,
  // select
  selectable: true,
  select: selectClick,
  eventDrop: function(info) {
    if(!info.event.allDay && !info.event.end) {
      calendarApi.getEventById(info.event.id).setEnd(new Date(new Date(info.event.start).getTime()+ 60*60*1000))
    }
  },
})
function updateTasks(events) {
  calendarTasks.value = events
}
watch(calendarTasks, async (n, o) => {
  localStorage.setItem('calendarTasks', JSON.stringify(n))
})

// mounted
import { detectMobile } from '@/scripts/mobile'

onMounted(() => {
  // get calendar api
  calendarApi = calendar.value.getApi()
  
  // get locale
  if(localStorage.getItem('locale')) {
    appLocale.value = localStorage.getItem('locale')
  }
  // set locale
  changeLocale(appLocale.value)

  // get task id
  taskId.value = JSON.parse(localStorage.getItem('id'))
  // get tasks
  let tasks = JSON.parse(localStorage.getItem('calendarTasks'))
  if(tasks) {
    for(let i = 0; i < tasks.length; i++) {
      calendarApi.addEvent(tasks[i])
    }
  }

  // screen orientation
  window.addEventListener('orientationchange', function() {
    if(detectMobile()) {
      if(window.orientation == 90 && calendarViewMode.value == 'dayGridMonth') {
        // landscape
        calendarApi.setOption('height', '200vh')
      } else if(window.orientation == 0) {
        // portrait
        calendarApi.setOption('height', '100vh')
      }
    }
  }, false)
})
// form
const taskForm = ref()
const taskFormOpen = ref(false)
const taskFormEditing = ref(false)

// form values
const formValues = ref({
  title: '',
  start: '',
  startTime: '',
  end: '',
  endTime: '',
  color: '',
  allDay: false,
})
// date pickers
const pickerStart = ref(null)
const pickerEnd = ref(null)
const pickerOpen = ref([false, false, false, false, false])
const pickerStartTime = ref('')
const pickerEndTime = ref('')
// watchers
watch(() => formValues.value.start, (newV, oldV) => {
  if(checkValidDay(newV) == true) {
    pickerStart.value = new Date(changeDateFormat(newV))
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
    pickerEnd.value = new Date(changeDateFormat(newV))
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
    pickerStartTime.value = new Date(`1/1/1 ${newV}`).toLocaleString('ru', { hour: '2-digit', minute: '2-digit' })
  }
  if(newV == '' || newV == undefined || newV == null) {
    pickerStartTime.value = ''
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
    pickerEndTime.value = new Date(`1/1/1 ${newV}`).toLocaleString('ru', { hour: '2-digit', minute: '2-digit' })
  }
  if(newV == '' || newV == undefined || newV == null) {
    pickerEndTime.value = ''
  }
  // validation
  if(taskForm.value && taskFormOpen.value && !formValues.value.allDay) {
    if(compareStartTimeEndTime() == true) {
      taskForm.value.items[3].validate()
      taskForm.value.items[5].validate()
    }
  }
})

// formatted task
const task = computed({
  get() {
    return {
      title: formValues.value.title,
      start: new Date(`${changeDateFormat(formValues.value.start)} ${formValues.value.startTime ? formValues.value.startTime : ''}`),
      end: new Date(`${changeDateFormat(formValues.value.end)} ${formValues.value.endTime ? formValues.value.endTime : ''}`),
      color: formValues.value.color,
      allDay: formValues.value.allDay,
    }
  }
})

// form validation
const checkValue = v => !!v || 'required'
// dates
const compareStartEnd = () => {
  if(formValues.value.start && formValues.value.end) {
    return (
      (new Date(changeDateFormat(formValues.value.start)).getTime() <= new Date(changeDateFormat(formValues.value.end)).getTime())
      &&
      (formValues.value.start != '' || formValues.value.end != '')
    ) || 'incorrect'
  } else {
    return true
  }
}
// times
const compareStartTimeEndTime = () => {
  if(
    (formValues.value.startTime && formValues.value.endTime && formValues.value.start && formValues.value.end)
    &&
    (new Date(changeDateFormat(formValues.value.start)).getTime() == new Date(changeDateFormat(formValues.value.end)).getTime())
  ) {
    return (
      (new Date(`1/1/1 ${formValues.value.startTime}`).toLocaleString('ru', { hour: '2-digit', minute: '2-digit' }) <= new Date(`1/1/1 ${formValues.value.endTime}`).toLocaleString('ru', { hour: '2-digit', minute: '2-digit' }))
      &&
      (formValues.value.startTime != '' || formValues.value.endTime != '')
    ) || 'incorrect'
  } else {
    return true
  }
}
const checkStartTimeValue = () => {
  if(!formValues.value.startTime && formValues.value.endTime) {
    return 'required'
  } else {
    return true
  }
}
const checkEndTimeValue = () => {
  if(formValues.value.startTime && !formValues.value.endTime) {
    return 'required'
  } else {
    return true
  }
}
// check valid  
const checkValidDay = v => {
  let date = changeDateFormat(v)

  return !isNaN(Date.parse(date)) || 'Invalid date'
}
const checkValidTime = v => {
  if(v) {
    let time = new Date(`1/1/1 ${v}`)
    return !isNaN(Date.parse(time)) || 'Invalid time'
  }
  return true
}

const rules = ref([checkValue])
const dateRules = ref([checkValue, checkValidDay, compareStartEnd])
const timeRules = ref([checkValidTime, compareStartTimeEndTime])
const allDayDateRules = ref([checkValue, checkValidDay])

// color picker
const pickColorBtn = ref()
const colors = [
  {
    title: 'red',
    value: '#F44336',
  },
  {
    title: 'green',
    value: '#4CAF50',
  },
  {
    title: 'blue',
    value: '#2196F3',
  },
  {
    title: 'orange',
    value: '#FF9800',
  },
  {
    title: 'purple',
    value: '#9C27B0',
  },
  {
    title: 'pink',
    value: '#F06292',
  },
]
const pickerColor = ref('')
function pickColor(isActive) {
  if(pickerColor.value) {
    formValues.value.color = pickerColor.value
  }
  isActive.value = false
}

// add task
function addTaskClick() {
  let date = new Date()
  taskFormEditing.value = false
  taskFormOpen.value = true
  formValues.value.color = colors[2].value
  formValues.value.start = date.toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
  formValues.value.end = date.toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
}
async function addTask(isActive) {
  const { valid } = await taskForm.value.validate()

  if(valid) {
    if(!formValues.value.allDay && !formValues.value.endTime && checkDays(changeDateFormat(formValues.value.start), changeDateFormat(formValues.value.end))) {
      formValues.value.endTime = '01:00'
    }

    let newTask = task.value
    newTask.id = createTaskId()

    calendarApi.addEvent(newTask)
    closeAddTask(isActive)
  }
}
function selectClick(selectInfo) { 
  calendarApi.unselect()
  taskFormEditing.value = false

  formValues.value.color = colors[2].value
  formValues.value.start = new Date(selectInfo.start).toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
  formValues.value.startTime = new Date(selectInfo.start).toLocaleString('ru', {hour: '2-digit', minute: '2-digit'})
  formValues.value.end = new Date(selectInfo.end.getTime()-1*24*60*60*1000).toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
  formValues.value.endTime = ''
  formValues.value.allDay = selectInfo.allDay

  if(!selectInfo.allDay && calendarViewMode.value !== 'dayGridMonth'){
    formValues.value.end = new Date(selectInfo.end).toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
    formValues.value.endTime = new Date(selectInfo.end).toLocaleString('ru', {hour: '2-digit', minute: '2-digit'})
  }
  if(selectInfo.allDay) {
    formValues.value.startTime = ''
  }
  if(calendarViewMode.value == 'dayGridMonth') {
    formValues.value.allDay = false
    formValues.value.startTime = ''

    if(selectInfo.start.getTime() != selectInfo.end.getTime()-1*24*60*60*1000) {
      formValues.value.end = new Date(selectInfo.end.getTime()-1*24*60*60*1000).toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
    }
  }

  taskFormOpen.value = true
}
function closeAddTask(isActive) {
  isActive.value = false
}

// task info
const taskInfoOpen = ref(false)
const currentTask = ref({})

function showTaskInfo(eventClickInfo) {
  currentTask.value = eventClickInfo.event
  taskInfoOpen.value = true
}

function deleteTask(isActive) {
  calendarApi.getEventById(currentTask.value.id).remove()
  isActive.value = false
}
function editTaskClick() {
  taskFormEditing.value = true

  formValues.value.title = currentTask.value.title
  formValues.value.color = currentTask.value.backgroundColor
  formValues.value.allDay = currentTask.value.allDay
  formValues.value.start = currentTask.value.start.toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})
  formValues.value.end = currentTask.value.start.toLocaleDateString(appLocale.value, {year: 'numeric', month: '2-digit', day: '2-digit'})

  if(!currentTask.value.allDay) {
    formValues.value.startTime = currentTask.value.start.toLocaleString(appLocale.value, {hour: '2-digit', minute: '2-digit'})
    formValues.value.endTime = currentTask.value.end.toLocaleString(appLocale.value, {hour: '2-digit', minute: '2-digit'})
  }
  taskFormOpen.value = true
}

// edit task
async function editTask(isActive) {
  const { valid } = await taskForm.value.validate()

  if(valid) {
    calendarApi.getEventById(currentTask.value.id).setProp('title', task.value.title)
    calendarApi.getEventById(currentTask.value.id).setProp('color', task.value.color)
    calendarApi.getEventById(currentTask.value.id).setAllDay(task.value.allDay)

    if(formValues.value.allDay) {
      calendarApi.getEventById(currentTask.value.id).setStart(task.value.start, { maintainDuration: true })
    } else {
      if(!formValues.value.endTime && checkDays(changeDateFormat(formValues.value.start), changeDateFormat(formValues.value.end))) {
        formValues.value.endTime = '01:00'
      }

      calendarApi.getEventById(currentTask.value.id).setStart(task.value.start)
      calendarApi.getEventById(currentTask.value.id).setEnd(task.value.end)
    }
    
    taskInfoOpen.value = false
    closeEditTask(isActive)
  }
}
function closeEditTask(isActive) {
  isActive.value = false
}

// view mode
const calendarViewModes = [
  {
    title: 'month',
    value: 'dayGridMonth'
  },
  {
    title: 'week',
    value: 'timeGridWeek'
  },
  {
    title: 'day',
    value: 'timeGridDay'
  },
  {
    title: 'list',
    value: 'listMonth'
  },
]
const calendarViewMode = ref('dayGridMonth')
watch(calendarViewMode, async (newValue, oldValue) => {
  calendarApi.changeView(newValue)
})
</script>