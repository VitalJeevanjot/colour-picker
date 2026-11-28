<template>
  <q-page v-if="!inEyedropperMode" class="picker-page">
    <TitleBar />

    <div class="picker-content q-pa-sm">
      <q-color v-model="store.colourSelected" class="picker-colour-control" />

      <div class="picker-controls">
        <div class="picker-toolbar">
          <q-btn
            class="picker-action"
            unelevated
            dense
            icon="colorize"
            :aria-label="$t('picker.start')"
            @click="openEyedropperViewer"
          >
            <q-tooltip class="picker-tooltip">
              <i18n-t keypath="picker.help" scope="global">
                <template #pick
                  ><strong>{{ $t("picker.pick") }}</strong></template
                >
                <template #cancel
                  ><strong>{{ $t("picker.cancel") }}</strong></template
                >
              </i18n-t>
            </q-tooltip>
          </q-btn>
          <q-btn
            class="picker-action"
            size="sm"
            unelevated
            dense
            icon="save"
            :aria-label="$t('picker.save')"
            @click="saveColourSelectedToList(store.colourSelected)"
          >
            <q-tooltip class="picker-tooltip">{{ $t("picker.save") }}</q-tooltip>
          </q-btn>
        </div>

        <div class="picker-toolbar q-my-sm">
          <div
            class="current-swatch"
            role="img"
            :aria-label="$t('picker.current')"
            :style="{ backgroundColor: store.colourSelected }"
          >
            <q-tooltip class="picker-tooltip">{{ $t("picker.current") }}</q-tooltip>
          </div>
          <q-btn
            class="picker-action"
            size="sm"
            unelevated
            dense
            icon="content_copy"
            :aria-label="$t('picker.copyHex')"
            @click="copyColour(store.colourSelected)"
          >
            <q-tooltip class="picker-tooltip">{{ $t("picker.copyHex") }}</q-tooltip>
          </q-btn>
          <q-btn
            class="picker-action"
            size="sm"
            unelevated
            dense
            icon="content_copy"
            :aria-label="$t('picker.copyRgb')"
            @click="copyCurrentColourRGB"
          >
            <q-tooltip class="picker-tooltip">{{ $t("picker.copyRgb") }}</q-tooltip>
          </q-btn>
        </div>

        <div v-for="(colour, index) in recentColours" :key="index" class="recent-colour q-mt-sm">
          <q-btn
            class="saved-swatch full-width"
            unelevated
            :style="{ backgroundColor: colour.colour }"
            :aria-label="$t('history.select')"
            @click="store.colourSelected = colour.colour"
          >
            <q-tooltip class="picker-tooltip">{{ $t("history.select") }}</q-tooltip>
          </q-btn>
          <div class="colour-details">
            <span>{{ colour.colour }}</span>
            <span>{{ colour.name || $t("history.unnamed") }}</span>
          </div>
        </div>

        <q-btn
          class="picker-action q-mt-sm"
          unelevated
          icon="history"
          :aria-label="$t('picker.openSaved')"
          @click="showAllSavedColours = true"
        >
          <q-tooltip class="picker-tooltip">{{ $t("picker.openSaved") }}</q-tooltip>
        </q-btn>
      </div>
    </div>

    <q-dialog v-model="showAllSavedColours" aria-labelledby="history-title">
      <q-card class="picker-dialog bg-black text-white">
        <q-card-section class="picker-dialog-header">
          <h2 id="history-title" class="picker-dialog-title">
            {{ $t("history.title", { count: savedColours.length }) }}
          </h2>
          <q-btn
            flat
            round
            icon="close"
            :aria-label="$t('common.close')"
            @click="showAllSavedColours = false"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="coloursFilterText"
            dark
            outlined
            dense
            color="grey-1"
            :label="$t('history.filter')"
          />

          <div
            v-for="{ colour, name, index } in filteredColours"
            :key="index"
            class="history-row q-mt-sm"
          >
            <div class="colour-details">
              <span>{{ colour }}</span>
              <span>{{ name || $t("history.unnamed") }}</span>
            </div>
            <div class="history-buttons">
              <q-btn
                class="picker-action"
                unelevated
                dense
                size="sm"
                icon="delete"
                :aria-label="$t('history.delete', { colour })"
                @click="deleteColourFromList(index)"
              >
                <q-tooltip class="picker-tooltip">{{ $t("history.delete", { colour }) }}</q-tooltip>
              </q-btn>
              <q-btn
                class="saved-swatch"
                unelevated
                v-close-popup
                :style="{ backgroundColor: colour }"
                :aria-label="$t('history.select')"
                @click="store.colourSelected = colour"
              />
              <q-btn
                class="picker-action"
                unelevated
                dense
                size="sm"
                icon="edit"
                :aria-label="$t('history.renameColour', { colour })"
              >
                <q-tooltip class="picker-tooltip">{{
                  $t("history.renameColour", { colour })
                }}</q-tooltip>
                <q-popup-proxy
                  @before-show="currentRenameText = name || ''"
                  @hide="renameColourFromList(index)"
                >
                  <q-banner class="bg-black rename-popup">
                    <template #avatar>
                      <q-btn
                        class="picker-action q-my-xs"
                        unelevated
                        dense
                        size="sm"
                        icon="edit"
                        v-close-popup
                        :aria-label="$t('history.edit')"
                      >
                        <q-tooltip class="picker-tooltip">{{ $t("history.edit") }}</q-tooltip>
                      </q-btn>
                    </template>
                    <q-input
                      v-model="currentRenameText"
                      dark
                      outlined
                      dense
                      color="grey-1"
                      :label="$t('history.rename')"
                      @keypress.enter="renameColourFromList(index)"
                    />
                  </q-banner>
                </q-popup-proxy>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { LocalStorage, Notify, copyToClipboard, colors } from "quasar";
import { useColourPicked } from "stores/colourPicked";
import TitleBar from "components/TitleBar.vue";

const savedColoursKey = "savedColoursSelected";

export default defineComponent({
  name: "IndexPage",
  components: { TitleBar },
  data() {
    return {
      inEyedropperMode: false,
      eyeDropperAbort: null,
      dismissNotification: null,
      store: useColourPicked(),
      savedColours: [],
      showAllSavedColours: false,
      coloursFilterText: "",
      currentRenameText: "",
    };
  },
  computed: {
    recentColours() {
      return this.savedColours.slice(-4).reverse();
    },
    filteredColours() {
      const query = this.coloursFilterText.toLowerCase();
      return this.savedColours
        .map((entry, index) => ({ ...entry, index }))
        .reverse()
        .filter(
          ({ colour, name }) =>
            colour?.toLowerCase().includes(query) || name?.toLowerCase().includes(query)
        );
    },
  },
  watch: {
    "$i18n.locale"() {
      this.dismissNotification?.();
      this.dismissNotification = null;
    },
  },
  methods: {
    showNotification(key, named, options) {
      this.dismissNotification?.();
      this.dismissNotification = Notify.create({ message: this.$t(key, named ?? {}), ...options });
    },
    async copyColour(colour) {
      try {
        await copyToClipboard(colour);
        this.showNotification(
          "clipboard.copied",
          { colour },
          { color: "grey-10", position: "top-left" }
        );
      } catch {
        this.showNotification("clipboard.failed");
      }
    },
    copyCurrentColourRGB() {
      const rgb = colors.hexToRgb(this.store.colourSelected);
      return this.copyColour([rgb.r, rgb.g, rgb.b].join());
    },
    saveColours() {
      LocalStorage.set(savedColoursKey, this.savedColours);
    },
    saveColourSelectedToList(colour) {
      if (this.savedColours.length >= 1200) return;
      this.savedColours.push({ name: null, colour });
      this.saveColours();
    },
    renameColourFromList(index) {
      const entry = this.savedColours[index];
      if (!entry) return;
      entry.name = this.currentRenameText;
      this.saveColours();
    },
    deleteColourFromList(index) {
      this.savedColours.splice(index, 1);
      this.saveColours();
    },
    cancelEyedropper() {
      this.eyeDropperAbort?.abort();
    },
    async openEyedropperViewer() {
      if (typeof window.EyeDropper !== "function") {
        this.showNotification("picker.unavailable");
        return;
      }

      const controller = new AbortController();
      this.eyeDropperAbort = controller;
      this.inEyedropperMode = true;
      try {
        const pick = new window.EyeDropper().open({ signal: controller.signal });
        window.electronAPI?.manageColourPickerViewer(true);
        const { sRGBHex } = await pick;
        this.store.newColour(sRGBHex);
        this.saveColourSelectedToList(sRGBHex);
      } catch (error) {
        if (controller.signal.aborted || error?.name === "AbortError") {
          this.showNotification("picker.cancelled");
        } else {
          window.electronAPI?.printLog(String(error));
          this.showNotification("picker.failed");
        }
      } finally {
        this.eyeDropperAbort = null;
        window.electronAPI?.manageColourPickerViewer(false);
        this.inEyedropperMode = false;
      }
    },
  },
  mounted() {
    this.savedColours = LocalStorage.getItem(savedColoursKey) || [];
    window.addEventListener("keydown", this.cancelEyedropper);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.cancelEyedropper);
    this.cancelEyedropper();
  },
});
</script>

<style scoped>
.picker-page {
  background-color: rgb(24, 24, 24);
}

.picker-content {
  display: grid;
  grid-template-columns: minmax(0, 250px) minmax(0, 1fr);
  gap: 0.5rem;
  align-items: start;
}

.picker-colour-control {
  width: 100%;
  border: 2px solid rgb(125, 125, 125);
}

.picker-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.current-swatch {
  width: 100px;
  height: 2rem;
  border: 1px solid white;
  border-radius: 4px;
}

.recent-colour {
  width: min(100%, max(120px, 30vw));
}

.colour-details {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0.5rem;
  color: #eee;
  font-size: 0.75rem;
  overflow-wrap: anywhere;
}

.colour-details span:last-child {
  text-align: end;
}

.history-buttons {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.5rem;
  align-items: center;
}

.saved-swatch {
  min-width: 0;
  border: 1px solid white;
}

.rename-popup {
  width: min(18rem, calc(100vw - 2rem));
}

@media (max-width: 430px) {
  .picker-content {
    grid-template-columns: minmax(0, 1fr);
  }

  .picker-colour-control {
    max-width: 250px;
  }
}
</style>
