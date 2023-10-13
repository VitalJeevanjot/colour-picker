<template>
  <div v-if="!inEyedropperMode">
    <q-page class="overflow" style="background-color: rgb(24, 24, 24)">
      <div
        id="toolbar"
        class="row q-pa-none"
        style="background-color: rgb(46, 46, 46)"
      >
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
                Left Click, <span style="font-weight: bold">Cancel:</span> Any
                Key Press)
              </q-tooltip>
            </q-btn>
            <q-btn
              class="text-white q-ml-sm q-my-sm"
              size="sm"
              unelevated
              dense
              style="background-color: rgb(54, 54, 54)"
              icon="save"
              @click="saveColourSelectedToList(store.colourSelected)"
            >
              <q-tooltip> Save colour on colour selector manually. </q-tooltip>
            </q-btn>
          </div>
          <!-- <div class="row q-mt-sm q-mb-md text-white">
            <q-btn
              class="q-pr-sm"
              unelevated
              style="
                background-color: rgb(38, 38, 38);
                text-transform: capitalize;
              "
              label="Start live colour finder"
            >
              <q-tooltip>
                Finds colour on page and highlight it. Cancel it by mouse click
                or key press.
              </q-tooltip>
            </q-btn>
          </div> -->
          <!-- -------- -->
          <!-- Last selected colour before close -->
          <div class="row q-mt-sm q-mb-md">
            <q-btn
              class="q-pr-sm"
              unelevated
              :style="`
                background-color: ${store.colourSelected};
                text-transform: capitalize;
                width: 100px;
                border: 1px solid white;`"
            >
              <q-tooltip>
                Finds colour on page and highlight it. Cancel it by mouse click
                or key press.
              </q-tooltip>
            </q-btn>
          </div>
          <!-- --- -->
          <div
            class="row q-mt-sm"
            v-for="(colour, i) in savedColours.slice().reverse().slice(0, 5)"
            :key="i"
          >
            <q-btn
              class="q-pr-sm"
              unelevated
              @click="store.colourSelected = colour.colour"
              :label="colour.name || colour.colour"
              :style="`
                background-color: ${colour.colour};
                color: white;
                text-shadow: 0px 0px 4px black;
                text-transform: capitalize;
                width: 30vw;
                min-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                border: 1px solid white`"
            >
              <q-tooltip>
                Finds colour on page and highlight it. Cancel it by mouse click
                or key press.
              </q-tooltip>
            </q-btn>
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
import { useQuasar } from "quasar";

export default defineComponent({
  name: "IndexPage",
  data() {
    return {
      inEyedropperMode: false,
      store: useColourPicked(),
      appSizeMaximised: false,
      savedColours: [],
      $q: useQuasar(),
    };
  },
  methods: {
    getSavedColours() {
      this.savedColours =
        this.$q.localStorage.getItem("savedColoursSelected") || [];
      return this.$q.localStorage.getItem("savedColoursSelected") || [];
    },
    saveColourSelectedToList(colour) {
      let currSaved =
        this.$q.localStorage.getItem("savedColoursSelected") || [];
      // console.log(currSaved);
      currSaved.push({ name: null, colour: colour });
      if (currSaved.length > 1200) {
        currSaved.splice(currSaved.length - 1, 1);
      }
      this.$q.localStorage.set("savedColoursSelected", currSaved);
      this.getSavedColours();
    },
    renameColourFromList(index, newName) {
      let getData = this.$q.localStorage.getItem("savedColoursSelected");
      if (getData) {
        getData[index].name = newName;
      }
      this.$q.localStorage.set("savedColoursSelected", getData);
    },
    deleteColourFromList(index) {
      let getData = this.$q.localStorage.getItem("savedColoursSelected");
      getData.splice(index, 1);
      this.$q.localStorage.set("savedColoursSelected", getData);
    },
    openEyedropper() {
      window._eyeDropper = new EyeDropper();
      window._abortController = new AbortController();

      window._eyeDropper
        .open({ signal: window._abortController.signal })
        .then((result) => {
          this.store.newColour(result.sRGBHex);
          window.electronAPI.manageColourPickerViewer(false);
          this.saveColourSelectedToList(result.sRGBHex);
          this.inEyedropperMode = false;
        })
        .catch((e) => {
          console.log(e);
          this.$q.notify(e.message);
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
    this.getSavedColours();
    window.addEventListener("keydown", (e) => {
      window._abortController?.abort();
    });
    // window.addEventListener("mov", (e) => {
    //   console.log(e.screenY);
    //   e.screenY < 10 ? changeAppState("maximise") : changeAppState("minimise");
    // });
  },
});
</script>

<!--
  (This not required yet)live colour viewer,
  (Done)make window sized to contents,
  Can keep atleast 1200 colours (renamable, search by name, select on colour picker, delete from list)
  Add save colour manually button on current selected colour,
  Custom icon creation
  Use the same size window as was used last time.
  Add the colour of the ehx at top right faded on each bar when listing in dialog.
-->
