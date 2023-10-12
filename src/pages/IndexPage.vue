<template>
  <div v-if="!inEyedropperMode">
    <q-page class="overflow" style="background-color: rgb(24, 24, 24)">
      <div class="row q-pa-none" style="background-color: rgb(46, 46, 46)">
        <q-avatar
          class="text-white self-center q-ml-sm titlebar"
          icon="colorize"
          size="sm"
        />
        <!-- Todo above avatar: change to original icon -->
        <span class="text-white q-my-xs q-ml-xs titlebar">Colour Picker</span>
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
      <!-- --------------------------------  -->
      <div class="row justify-center q-pa-sm">
        <div class="col-auto">
          <q-color
            v-model="store.colourSelected"
            class="my-picker"
            style="
              width: 20vw;
              min-width: 250px;
              border: 2px solid rgb(125, 125, 125);
            "
          />
        </div>
        <div class="col-auto q-ml-sm">
          <div class="row">
            <q-btn
              class="text-white"
              unelevated
              dense
              style="background-color: rgb(54, 54, 54)"
              icon="colorize"
              @click="openEyedropperViewer"
            >
              <q-tooltip>
                Start colour picker (<span style="font-weight: bold"
                  >Pick:</span
                >
                Left Click, <span style="font-weight: bold">Cancel:</span> Right
                Click)
              </q-tooltip>
            </q-btn>
          </div>
          <div class="row q-mt-sm text-white">
            <q-checkbox
              keep-color
              class="q-pr-sm"
              color="grey-9"
              style="background-color: rgb(38, 38, 38)"
              v-model="colourPickerRemainOnTop"
              label="Hide the app"
            >
              <q-tooltip>
                Hide the app when colour picker starts on checked
              </q-tooltip>
            </q-checkbox>
          </div>
          <div class="row q-mt-sm text-white">
            <q-checkbox
              keep-color
              class="q-pr-sm"
              color="grey-9"
              style="background-color: rgb(38, 38, 38)"
              v-model="colourPickerRemainOnTop"
              label="Live colour finder"
            >
              <q-tooltip>
                Finds colour on page and highlight it when checked
              </q-tooltip>
            </q-checkbox>
          </div>
        </div>
      </div>
    </q-page>
  </div>
</template>

<style>
.q-space {
  -webkit-app-region: drag;
}
.titlebar {
  -webkit-app-region: drag;
}
</style>

<script>
import { defineComponent } from "vue";
import { useColourPicked } from "stores/colourPicked";
import { event } from "quasar";

export default defineComponent({
  name: "IndexPage",
  data() {
    return {
      inEyedropperMode: false,
      colourPickerRemainOnTop: true,
      store: useColourPicked(),
      appSizeMaximised: false,
    };
  },
  methods: {
    openEyedropper() {
      const eyeDropper = new EyeDropper();

      eyeDropper
        .open()
        .then((result) => {
          this.store.newColour(result.sRGBHex);
          window.electronAPI.manageColourPickerViewer(false);
          this.inEyedropperMode = false;
        })
        .catch((e) => {
          console.log(e);
          window.electronAPI.printLog(e.message);
          window.electronAPI.manageColourPickerViewer(false);
          this.inEyedropperMode = false;
        });
    },
    openEyedropperViewer() {
      this.inEyedropperMode = true;
      this.openEyedropper();
      window.electronAPI.manageColourPickerViewer(true);
    },

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
  async mounted() {
    this.isAppMaximised();
  },
});
</script>
