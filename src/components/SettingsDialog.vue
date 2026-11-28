<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    aria-labelledby="settings-title"
  >
    <q-card class="picker-dialog bg-grey-10 text-white">
      <q-card-section class="picker-dialog-header">
        <h2 id="settings-title" class="picker-dialog-title">{{ $t("settings.title") }}</h2>
        <q-btn
          flat
          round
          icon="close"
          :aria-label="$t('common.close')"
          @click="$emit('update:modelValue', false)"
        />
      </q-card-section>
      <q-card-section>
        <label class="settings-language">
          <span>{{ $t("settings.language") }}</span>
          <select :value="languagePreference" @change="setLanguagePreference($event.target.value)">
            <option :value="SYSTEM_LANGUAGE">{{ $t("settings.systemDefault") }}</option>
            <option v-for="{ value, label } in languageOptions" :key="value" :value="value">
              {{ label }}
            </option>
          </select>
        </label>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { languageOptions, languagePreference, setLanguagePreference } from "boot/i18n";
import { SYSTEM_LANGUAGE } from "../i18n/locale.mjs";

defineProps({ modelValue: Boolean });
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.settings-language {
  display: grid;
  gap: 0.5rem;
  overflow-wrap: anywhere;
}

.settings-language select {
  width: 100%;
  min-width: 0;
  min-height: 2.5rem;
  padding: 0.25rem 0.5rem;
  font: inherit;
  color-scheme: dark;
}
</style>
