<template>
  <div
    id="toolbar"
    class="row q-pa-none"
    style="background-color: rgb(46, 46, 46)"
  >
    <q-avatar class="text-white self-center q-ml-sm titlebar" size="sm">
      <img src="colour picker logo.png"
    /></q-avatar>
    <!-- Todo above avatar: change to original icon -->
    <span class="text-white q-my-xs q-ml-sm titlebar">Colour Picker</span>
    <q-space />
    <q-btn
      class="text-white q-my-xs"
      unelevated
      dense
      size="sm"
      style="background-color: rgb(54, 54, 54)"
      icon="remove"
      @click="changeAppState('minimise')"
      ><q-tooltip>Minimise</q-tooltip></q-btn
    >
    <q-btn
      class="text-white q-my-xs q-ml-xs"
      unelevated
      dense
      size="sm"
      style="background-color: rgb(54, 54, 54)"
      :icon="`${appSizeMaximised ? 'crop_7_5' : 'crop_square'}`"
      @click="changeAppState('maximise')"
    >
      <q-tooltip v-if="appSizeMaximised">Minimise</q-tooltip>
      <q-tooltip v-if="!appSizeMaximised">Maximise</q-tooltip>
    </q-btn>
    <q-btn
      class="text-white q-my-xs q-ml-xs q-mr-xs"
      unelevated
      dense
      size="sm"
      style="background-color: rgb(54, 54, 54)"
      icon="close"
      @click="changeAppState('exit')"
      ><q-tooltip>Exit</q-tooltip></q-btn
    >
  </div>
</template>
<style scoped>
.q-space {
  -webkit-app-region: drag;
}
.titlebar {
  -webkit-app-region: drag;
}
</style>
<script>
export default {
  name: "TitleBar",
  data() {
    return {
      appSizeMaximised: false,
    };
  },
  methods: {
    changeAppState(state) {
      // minimise, maximise, exit
      window.electronAPI.changeAppState(state);
      // console.log(this.appSizeMaximised);
      this.isAppMaximised();
    },
    async isAppMaximised() {
      this.appSizeMaximised = await window.electronAPI.getAppSize();
    },
  },
  mounted() {
    this.isAppMaximised();
  },
};
</script>
