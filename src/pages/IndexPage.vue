<template>
  <div v-if="!inEyedropperMode">
    <q-page class="overflow" style="background-color: rgb(24, 24, 24)">
      <TitleBar />
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
              :ripple="false"
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
            class="q-mt-sm"
            v-for="(colour, i) in savedColours.slice().reverse().slice(0, 4)"
            :key="i"
          >
            <div class="row">
              <q-btn
                class="q-pr-sm"
                unelevated
                @click="store.colourSelected = colour.colour"
                :label="colour.name || 'unNamed'"
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
                  Finds colour on page and highlight it. Cancel it by mouse
                  click or key press.
                </q-tooltip>
              </q-btn>
            </div>
            <div class="row">
              <span class="text-caption text-grey-3 q-mr-sm">{{
                colour.colour
              }}</span>
            </div>
          </div>
          <!-- --- -->
          <div class="row q-mt-sm">
            <q-btn
              unelevated
              icon="history"
              @click="showAllSavedColours = true"
              :style="`
                background-color: rgb(46, 46, 46);
                color: white;
                text-transform: capitalize;
                min-height: 20px;
               `"
            >
              <q-tooltip> Open all saved colours. </q-tooltip>
            </q-btn>
          </div>
          <!-- Dialog -->
          <q-dialog v-model="showAllSavedColours">
            <q-card class="q-pb-md q-px-md bg-black">
              <div class="row items-center justify-around q-pt-sm">
                <span class="text-white" style="user-select: none"
                  >Saved Colours ({{ savedColours.length }})</span
                >
                <q-space />
                <q-btn
                  class="text-white"
                  icon="close"
                  dense
                  unelevated
                  @click="showAllSavedColours = false"
                ></q-btn>
              </div>
              <div class="row items-center justify-around q-mb-md q-mt-md">
                <q-input
                  dark
                  label="Filter"
                  class="text-white"
                  outlined
                  dense
                  v-model="coloursFilterText"
                  color="grey-1"
                ></q-input>
              </div>
              <!-- colours in dialog -->
              <div
                v-for="(colour, i) in savedColours.slice().reverse()"
                :key="i"
              >
                <div class="row q-mt-sm q-mx-xl">
                  <span
                    class="text-caption text-grey-3 q-mr-sm"
                    style="overflow: hidden; text-overflow: ellipsis"
                    >{{ colour.colour }}</span
                  >
                </div>
                <div class="row justify-center q-mx-xl">
                  <q-btn
                    class="q-pr-sm"
                    unelevated
                    v-close-popup
                    @click="store.colourSelected = colour.colour"
                    :style="`
                background-color: ${colour.colour};
                color: white;
                text-shadow: 0px 0px 4px black;
                text-transform: capitalize;
                width: 30vw;
                min-width: 120px;
                border: 1px solid white`"
                  >
                    <span style="overflow: hidden; text-overflow: ellipsis">{{
                      colour.name || "unNamed"
                    }}</span>
                  </q-btn>
                </div>

                <div class="row justify-center q-mx-xl">
                  <q-btn
                    style="
                      min-height: 0px;
                      width: 10vw;
                      min-width: 40px;
                      height: 10px;
                      border-radius: 0px 0px 0px 2px;
                      padding: 0;
                      margin: 0;
                      background-color: rgb(0, 94, 184);
                    "
                    @click="deleteColourFromList(i)"
                  >
                    <q-tooltip>Delete {{ colour.colour }}</q-tooltip>
                  </q-btn>
                  <q-btn
                    style="
                      min-height: 0px;
                      width: 10vw;
                      min-width: 40px;
                      height: 10px;
                      border-radius: 0px 0px 2px 0px;
                      padding: 0;
                      margin: 0;
                      background-color: rgb(255, 255, 255);
                    "
                  >
                    <q-tooltip>Rename {{ colour.colour }}</q-tooltip>
                    <q-popup-proxy
                      @before-show="currentRenameText = colour.name"
                      @hide="renameColourFromList(i)"
                    >
                      <q-banner class="bg-black">
                        <template v-slot:avatar>
                          <q-btn
                            class="text-white q-my-xs"
                            unelevated
                            dense
                            size="sm"
                            icon="edit"
                            v-close-popup
                            ><q-tooltip>Edit</q-tooltip></q-btn
                          >
                        </template>
                        <q-input
                          dark
                          label="Rename"
                          class="text-white"
                          outlined
                          dense
                          @keypress.enter="renameColourFromList(i)"
                          v-model="currentRenameText"
                          color="grey-1"
                        ></q-input>
                      </q-banner>
                    </q-popup-proxy>
                  </q-btn>
                </div>
              </div>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </q-page>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-thumb {
  background: #828282;
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  background: #424242;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #bcbcbc;
}
</style>

<script>
import { defineComponent } from "vue";
import { useColourPicked } from "stores/colourPicked";
import { useQuasar } from "quasar";
import TitleBar from "components/TitleBar.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    TitleBar,
  },
  data() {
    return {
      inEyedropperMode: false,
      store: useColourPicked(),
      savedColours: [],
      showAllSavedColours: false,
      $q: useQuasar(),
      coloursFilterText: "",
      currentRenameText: "",
    };
  },
  methods: {
    getSavedColours() {
      this.savedColours =
        this.$q.localStorage.getItem("savedColoursSelected") || [];
    },
    saveColourSelectedToList(colour) {
      // console.log(currSaved);
      this.savedColours.push({ name: null, colour: colour });
      if (this.savedColours.length > 1200) {
        this.savedColours.splice(this.savedColours.length - 1, 1);
      }
      this.$q.localStorage.set("savedColoursSelected", this.savedColours);
      this.getSavedColours();
    },
    renameColourFromList(index) {
      let getData = this.$q.localStorage.getItem("savedColoursSelected");
      if (getData) {
        getData[this.savedColours.length - 1 - index].name =
          this.currentRenameText;
      }
      this.$q.localStorage.set("savedColoursSelected", getData);
      this.getSavedColours();
    },
    deleteColourFromList(index) {
      console.log("Trying to call");
      let getData = this.$q.localStorage.getItem("savedColoursSelected");
      getData.splice(this.savedColours.length - 1 - index, 1); // because its in reverse
      this.$q.localStorage.set("savedColoursSelected", getData);
      this.getSavedColours();
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
  },

  async mounted() {
    this.getSavedColours();
    window.addEventListener("keydown", (e) => {
      window._abortController?.abort("picker closed");
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
