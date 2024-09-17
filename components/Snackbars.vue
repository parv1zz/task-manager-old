<template>
  <!-- reminder -->
  <v-snackbar
    v-model="snackbars[0].open"
    timeout="5000"
  >
    <div class="text-[18px]">{{ snackbars[0].title }}</div>
    <div>{{ snackbars[0].text }}</div>

    <template v-slot:actions>
      <v-btn
        color="blue"
        variant="text"
        @click="snackbars[0].open = false"
      >Close</v-btn>
    </template>
  </v-snackbar>

  <!-- actions -->
  <!-- for saved -->
  <v-snackbar
    v-model="snackbars[1].open"
    variant="outlined"
    color="success"
    class="relative overflow-hidden"
    location="bottom right"
    :timeout="snackbarTimeout"
  >
    <div class="z-[-1] absolute left-0 top-0 w-full h-full bg-white"></div>

    <div class="flex items-center">
      <v-icon class="mr-4">mdi-information</v-icon>
      <b class="mr-1">{{ snackbars[1].title }}</b>
      <span>{{ snackbars[1].text }}</span>
    </div>

    <template v-slot:actions>
      <v-btn
        size="x-small"
        icon="mdi-close"
        @click="snackbars[1].open = false"
      ></v-btn>
    </template>
  </v-snackbar>
  <!-- for added -->
  <v-snackbar
    v-model="snackbars[2].open"
    variant="outlined"
    color="success"
    class="relative overflow-hidden"
    location="bottom right"
    :timeout="snackbarTimeout"
  >
    <div class="z-[-1] absolute left-0 top-0 w-full h-full bg-white"></div>

    <div class="flex items-center">
      <v-icon class="mr-4">mdi-information</v-icon>
      <b class="mr-1">{{ snackbars[2].title }}</b>
      <span>{{ snackbars[2].text }}</span>
    </div>

    <template v-slot:actions>
      <v-btn
        size="x-small"
        icon="mdi-close"
        @click="snackbars[2].open = false"
      ></v-btn>
    </template>
  </v-snackbar>
  <!-- for deleted -->
  <v-snackbar
    v-model="snackbars[3].open"
    variant="outlined"
    color="success"
    class="relative overflow-hidden"
    location="bottom right"
    :timeout="snackbarTimeout"
  >
    <div class="z-[-1] absolute left-0 top-0 w-full h-full bg-white"></div>

    <div class="flex items-center">
      <v-icon class="mr-4">mdi-information</v-icon>
      <b class="mr-1">{{ snackbars[3].title }}</b>
      <span>{{ snackbars[3].text }}</span>
    </div>

    <template v-slot:actions>
      <v-btn
        size="x-small"
        icon="mdi-close"
        @click="snackbars[3].open = false"
      ></v-btn>
    </template>
  </v-snackbar>
  <!-- for reminders -->
  <v-snackbar
    v-model="snackbars[4].open"
    variant="outlined"
    color="info"
    class="relative overflow-hidden"
    location="bottom right"
    :timeout="snackbarTimeout"
  >
    <div class="z-[-1] absolute left-0 top-0 w-full h-full bg-white"></div>

    <div class="flex items-center">
      <v-icon class="mr-4">mdi-information</v-icon>
      <span>Reminders for</span>
      <b class="mx-1">{{ snackbars[4].title }}</b>
      <span>updated</span>
    </div>

    <template v-slot:actions>
      <v-btn
        size="x-small"
        icon="mdi-close"
        @click="snackbars[4].open = false"
      ></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { snackbars, snackbarTimeout } from '~/scripts/snackbars'
</script>