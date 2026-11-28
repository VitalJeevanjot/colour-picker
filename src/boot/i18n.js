import { boot } from "quasar/wrappers";
import { LocalStorage, Quasar } from "quasar";
import { ref } from "vue";
import { createI18n } from "vue-i18n";
import en from "quasar/lang/en-US";
import es from "quasar/lang/es";
import ptBR from "quasar/lang/pt-BR";
import fr from "quasar/lang/fr";
import de from "quasar/lang/de";
import it from "quasar/lang/it";
import nl from "quasar/lang/nl";
import pl from "quasar/lang/pl";
import tr from "quasar/lang/tr";
import ru from "quasar/lang/ru";
import ja from "quasar/lang/ja";
import ko from "quasar/lang/ko-KR";
import zhHans from "quasar/lang/zh-CN";
import id from "quasar/lang/id";
import hi from "quasar/lang/hi";
import { messages } from "../i18n/messages";
import {
  DEFAULT_LOCALE,
  SYSTEM_LANGUAGE,
  isSupportedLocale,
  locales,
  resolveLocale,
} from "../i18n/locale.mjs";

const storageKey = "colourPickerLanguage";
const quasarPacks = {
  en,
  es,
  "pt-BR": ptBR,
  fr,
  de,
  it,
  nl,
  pl,
  tr,
  ru,
  ja,
  ko,
  "zh-Hans": zhHans,
  id,
  hi,
};
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages,
});

let systemLocale = DEFAULT_LOCALE;
export const languagePreference = ref(SYSTEM_LANGUAGE);
export const languageOptions = locales.map((value) => ({
  value,
  label: messages[value].languageName,
}));

function applyLanguage(preference) {
  languagePreference.value = isSupportedLocale(preference) ? preference : SYSTEM_LANGUAGE;
  const locale =
    languagePreference.value === SYSTEM_LANGUAGE ? systemLocale : languagePreference.value;
  i18n.global.locale.value = locale;
  Quasar.lang.set(quasarPacks[locale]);
  document.documentElement.lang = locale;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", i18n.global.t("app.description"));
}

export function setLanguagePreference(preference) {
  applyLanguage(preference);
  LocalStorage.set(storageKey, languagePreference.value);
}

export default boot(async ({ app }) => {
  try {
    systemLocale = resolveLocale(await window.electronAPI?.getAppLocale());
  } catch {
    systemLocale = DEFAULT_LOCALE;
  }
  applyLanguage(LocalStorage.getItem(storageKey));
  app.use(i18n);
});
