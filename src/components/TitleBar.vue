<template>
  <div id="toolbar" class="row items-center q-pa-none picker-titlebar">
    <q-avatar class="q-ml-sm titlebar" size="sm">
      <img src="colour picker logo.png" alt="" />
    </q-avatar>
    <span class="q-my-xs q-ml-sm titlebar">{{ $t("app.title") }}</span>
    <q-space />

    <q-btn
      class="picker-action q-my-xs q-ml-xs"
      unelevated
      dense
      size="sm"
      icon="settings"
      :aria-label="$t('settings.title')"
      @click="settingsOpen = true"
    >
      <q-tooltip class="picker-tooltip">{{ $t("settings.title") }}</q-tooltip>
    </q-btn>

    <template v-if="hasWindowControls">
      <q-btn
        class="picker-action q-my-xs q-ml-xs"
        unelevated
        dense
        size="sm"
        icon="remove"
        :aria-label="$t('window.minimise')"
        @click="changeAppState('minimise')"
      >
        <q-tooltip class="picker-tooltip">{{ $t("window.minimise") }}</q-tooltip>
      </q-btn>

      <q-btn
        class="picker-action q-my-xs q-ml-xs"
        unelevated
        dense
        size="sm"
        :icon="appSizeMaximised ? 'crop_7_5' : 'crop_square'"
        :aria-label="$t(windowSizeKey)"
        @click="changeAppState('maximise')"
      >
        <q-tooltip class="picker-tooltip">{{ $t(windowSizeKey) }}</q-tooltip>
      </q-btn>

      <q-btn
        class="picker-action q-my-xs q-ml-xs q-mr-xs"
        unelevated
        dense
        size="sm"
        icon="close"
        :aria-label="$t('window.exit')"
        @click="changeAppState('exit')"
      >
        <q-tooltip class="picker-tooltip">{{ $t("window.exit") }}</q-tooltip>
      </q-btn>
    </template>
  </div>

  <SettingsDialog v-model="settingsOpen" />
</template>

<script>
import SettingsDialog from "components/SettingsDialog.vue";

export default {
  name: "TitleBar",
  components: { SettingsDialog },
  data() {
    return {
      appSizeMaximised: false,
      settingsOpen: false,
      hasWindowControls: Boolean(globalThis.electronAPI),
    };
  },
  computed: {
    windowSizeKey() {
      return this.appSizeMaximised ? "window.restore" : "window.maximise";
    },
  },
  methods: {
    changeAppState(state) {
      window.electronAPI.changeAppState(state);
      if (state === "maximise") this.updateWindowSize();
    },
    async updateWindowSize() {
      this.appSizeMaximised = await window.electronAPI.getAppSize();
    },
  },
  mounted() {
    if (this.hasWindowControls) this.updateWindowSize();
  },
};
</script>

<style scoped>
.picker-titlebar {
  background-color: rgb(46, 46, 46);
  color: white;
}

.q-space,
.titlebar {
  -webkit-app-region: drag;
}
</style>
