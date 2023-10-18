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
              <q-tooltip> Current colour </q-tooltip>
            </q-btn>
            <q-btn
              class="text-white q-ml-sm q-my-sm"
              size="sm"
              unelevated
              dense
              style="background-color: rgb(54, 54, 54)"
              icon="content_copy"
              @click="copyCurrentColourHEX()"
            >
              <q-tooltip> Copy current colour hex. </q-tooltip>
            </q-btn>
            <q-btn
              class="text-white q-ml-sm q-my-sm"
              size="sm"
              unelevated
              dense
              style="background-color: rgb(54, 54, 54)"
              icon="content_copy"
              @click="copyCurrentColourRGB()"
            >
              <q-tooltip> Copy current colour rgb. </q-tooltip>
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
                :style="`
                background-color: ${colour.colour};
                color: white;
                text-shadow: 0px 0px 4px black;
                text-transform: capitalize;
                width: 30vw;
                min-width: 120px;
                border: 1px solid white`"
              >
                <q-tooltip> Select Colour </q-tooltip>
              </q-btn>
            </div>
            <div
              class="row justify-around"
              style="
                white-space: nowrap;
                overflow: hidden;
                width: 30vw;
                min-width: 120px;
              "
            >
              <div class="col-sm-3 text-left">
                <span class="text-caption text-grey-3 q-mr-sm"
                  >{{ colour.colour }}
                </span>
              </div>
              <div class="col text-right">
                <span style="color: white; font-size: 0.6rem">
                  {{ colour.name || "unNamed" }}
                </span>
              </div>
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
                v-for="(colour, i) in savedColours
                  .slice()
                  .reverse()
                  .filter(
                    (val) =>
                      val?.colour
                        ?.toLowerCase()
                        .includes(coloursFilterText.toLowerCase()) ||
                      val?.name
                        ?.toLowerCase()
                        .includes(coloursFilterText.toLowerCase())
                  )"
                :key="i"
              >
                <!-- <div class="row q-mt-sm q-mx-xl">
                  <span
                    class="text-caption text-grey-3 q-mr-sm"
                    style="overflow: hidden; text-overflow: ellipsis"
                    >{{ colour.colour }}</span
                  >
                </div> -->
                <div
                  class="row q-mt-sm q-mx-xl justify-center"
                  style="white-space: nowrap; overflow: hidden"
                >
                  <div class="col-sm-3 text-left">
                    <span class="text-caption text-grey-3 q-mr-sm"
                      >{{ colour.colour }}
                    </span>
                  </div>
                  <div class="col text-right">
                    <span style="color: white; font-size: 0.6rem">
                      {{ colour.name || "unNamed" }}
                    </span>
                  </div>
                </div>

                <div class="row justify-center q-mx-xl">
                  <q-btn
                    class="q-mr-sm self-center text-grey-4"
                    unelevated
                    dense
                    size="sm"
                    icon="delete"
                    style="background-color: rgb(54, 54, 54)"
                    @click="deleteColourFromList(i)"
                  >
                    <q-tooltip>Delete {{ colour.colour }}</q-tooltip>
                  </q-btn>
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
                  </q-btn>
                  <q-btn
                    class="q-ml-sm self-center text-grey-4"
                    unelevated
                    dense
                    size="sm"
                    icon="edit"
                    style="background-color: rgb(54, 54, 54)"
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

                <!-- <div class="row justify-center q-mx-xl">
                  <q-btn
                    style="
                      min-height: 0px;
                      width: 10vw;
                      min-width: 40px;
                      height: 6px;
                      border-radius: 0px 0px 2px 0px;
                      padding: 0;
                      margin: 0;
                      background-color: rgb(25, 138, 80);
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
                </div> -->
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
import { useQuasar, copyToClipboard, colors } from "quasar";
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
    copyCurrentColourHEX() {
      copyToClipboard(this.store.colourSelected)
        .then(() => {
          // success!
          this.$q.notify({
            message: "Copied " + this.store.colourSelected,
            color: "grey-10",
            position: "top-left",
          });
        })
        .catch((e) => {
          this.$q.notify({ message: e.message });
        });
    },
    copyCurrentColourRGB() {
      const toRGB = colors.hexToRgb(this.store.colourSelected);
      const rgbJoined = [toRGB.r, toRGB.g, toRGB.b].join();
      copyToClipboard(rgbJoined)
        .then(() => {
          // success!
          this.$q.notify({
            message: "Copied " + rgbJoined,
            color: "grey-10",
            position: "top-left",
          });
        })
        .catch((e) => {
          this.$q.notify({ message: e.message });
        });
    },
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
          if(e) {
            this.$q.notify({
                message: e?.toString()
              });
              window.electronAPI.printLog(e.toString());
            }
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
  (This is not required yet)Use the same size window as was used last time.
  (Done)make window sized to contents,
  (Done)Can keep atleast 1200 colours (renamable, search by name, select on colour picker, delete from list)
  (Done)Add save colour manually button on current selected colour,
  (Done)Add the colour of the hex at top right faded on each bar when listing in dialog.
  Custom icon creation
-->
