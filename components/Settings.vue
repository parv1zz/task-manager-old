<template>
  <v-dialog
    transition="dialog-bottom-transition"
    fullscreen
    v-model="dialog"
  >
    <!-- btn -->
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        icon="mdi-cog"
        variant="text"
        v-bind="activatorProps"
      ></v-btn>
    </template>

    <v-card>
      <!-- toolbar -->
      <v-toolbar>
        <v-btn
          icon="mdi-arrow-left"
          @click="dialog = false"
        ></v-btn>

        <v-toolbar-title>{{ $t('settings.title') }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items>
        </v-toolbar-items>
      </v-toolbar>

      <v-list lines="two">
        <v-list-subheader>{{ $t('settings.language-and-region') }}</v-list-subheader>

        <v-list-item>
          <div class="flex">
            <div class="item">
              <v-list-item-title>{{ $t('settings.language') }}</v-list-item-title>
              <v-list-item-subtitle>{{ $t('settings.app-language') }}</v-list-item-subtitle>
            </div>
            <v-select
              max-width="150"
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
                      <img width="25" :src="`https://humresdb.com/languages/imgList/${item.title}.svg`" />
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </template>
              <template v-slot:selection="{ item, index }">
                <img class="ml-n1" width="25" :src="`https://humresdb.com/languages/imgList/${item.title}.svg`" />
                <div class="ml-2">{{ item.title }}</div>
              </template>
            </v-select>
          </div>
        </v-list-item>
        
        <Divider />

        <v-list-subheader>{{ $t('settings.import-and-export') }}</v-list-subheader>
        <v-list-item>
          <div class="flex">
            <div class="item">
              <v-list-item-title>{{ $t('settings.import') }}</v-list-item-title>
              <v-list-item-subtitle>{{ $t('settings.import-from-json-file') }}</v-list-item-subtitle>
            </div>
            <v-btn
              color="success"
              max-width="150"
              height="40"
              elevation="0"
              prepend-icon="mdi-file-import"
            >{{ $t('settings.import') }}</v-btn>
          </div>
        </v-list-item>
        <v-list-item>
          <div class="flex">
            <div class="item">
              <v-list-item-title>{{ $t('settings.export') }}</v-list-item-title>
              <v-list-item-subtitle>{{ $t('settings.export-to-json-file') }}</v-list-item-subtitle>
            </div>
            <v-btn
              max-width="150"
              color="primary"
              height="40"
              elevation="0"
              prepend-icon="mdi-export"
            >{{ $t('settings.export') }}</v-btn>
          </div>
        </v-list-item>

        <Divider />

        <v-list-subheader>{{ $t('settings.calendar') }}</v-list-subheader>
        <v-list-item>
          <div class="flex">
            <div class="item">
              <v-list-item-title>ID</v-list-item-title>
              <v-list-item-subtitle>Connect other devices</v-list-item-subtitle>
            </div>
            <v-btn
              color="error"
              max-width="150"
              width="133"
              height="40"
              elevation="0"
            >
              <template v-slot:prepend="">
                <v-icon class="ml-n6" size="x-large">mdi-identifier</v-icon>
              </template>
              Get ID
            </v-btn>
          </div>
        </v-list-item>
        <v-list-item>
          <div class="flex">
            <div class="item">
              <v-list-item-title>Connect</v-list-item-title>
              <v-list-item-subtitle>Connect to other device</v-list-item-subtitle>
            </div>
            <v-btn
              color="error"
              max-width="150"
              height="40"
              elevation="0"
              prepend-icon="mdi-lan-connect"
            >Connect</v-btn>
          </div>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { locales, appLocale } from '@/scripts/locale'

const dialog = ref(false)
</script>

<style scoped lang="scss">
.item {
  width: 215px;
  margin-right: 24px;
}
</style>