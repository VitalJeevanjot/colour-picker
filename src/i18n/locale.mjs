export const DEFAULT_LOCALE = "en";
export const SYSTEM_LANGUAGE = "system";
export const locales = [
  "en",
  "es",
  "pt-BR",
  "fr",
  "de",
  "it",
  "nl",
  "pl",
  "tr",
  "ru",
  "ja",
  "ko",
  "zh-Hans",
  "id",
  "hi",
];

export function isSupportedLocale(locale) {
  return locales.includes(locale);
}

export function resolveLocale(locale) {
  const tag = typeof locale === "string" ? locale.trim().replace(/_/g, "-").toLowerCase() : "";
  const [language, ...subtags] = tag.split("-");
  if (language === "pt") return "pt-BR";
  if (language === "zh") {
    if (subtags.includes("hant")) return DEFAULT_LOCALE;
    if (subtags.includes("hans")) return "zh-Hans";
    return subtags.some((part) => ["tw", "hk", "mo"].includes(part)) ? DEFAULT_LOCALE : "zh-Hans";
  }
  return isSupportedLocale(language) ? language : DEFAULT_LOCALE;
}
