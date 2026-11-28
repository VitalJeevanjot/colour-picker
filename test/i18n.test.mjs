import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { createI18n } from "vue-i18n";
import { DEFAULT_LOCALE, locales, resolveLocale } from "../src/i18n/locale.mjs";

const directory = new URL("../src/i18n/", import.meta.url);
const messages = Object.fromEntries(
  locales.map((locale) => [
    locale,
    JSON.parse(readFileSync(new URL(`${locale}.json`, directory), "utf8")),
  ])
);

function flatten(messages, prefix = "") {
  return Object.fromEntries(
    Object.entries(messages).flatMap(([key, value]) => {
      const path = `${prefix}${key}`;
      return typeof value === "string"
        ? [[path, value]]
        : Object.entries(flatten(value, `${path}.`));
    })
  );
}

function placeholders(message) {
  return (message.match(/\{[^{}]+\}/g) ?? []).sort();
}

test("each locale has the same message keys and placeholders as English", () => {
  const files = readdirSync(directory).filter((filename) => filename.endsWith(".json"));
  assert.deepEqual(files.sort(), locales.map((locale) => `${locale}.json`).sort());
  const english = flatten(messages.en);
  const i18n = createI18n({
    legacy: false,
    locale: DEFAULT_LOCALE,
    fallbackLocale: DEFAULT_LOCALE,
    messages,
  });
  const values = { count: 1200, colour: "#ff8000", pick: "PICK", cancel: "CANCEL" };
  for (const locale of locales) {
    const translations = flatten(messages[locale]);
    assert.deepEqual(Object.keys(translations).sort(), Object.keys(english).sort(), locale);
    assert.equal(messages[locale].app.title, "Colour Picker");
    for (const [key, translation] of Object.entries(translations)) {
      assert.ok(translation.trim(), `${locale}: ${key}`);
      assert.deepEqual(placeholders(translation), placeholders(english[key]), `${locale}: ${key}`);
      const expected = translation.replace(/\{([^{}]+)\}/g, (_, name) => {
        assert.ok(Object.hasOwn(values, name), `Missing test value for ${name}`);
        return values[name];
      });
      assert.equal(i18n.global.t(key, { ...values }, { locale }), expected, `${locale}: ${key}`);
    }
  }
});

test("regional system locales map to supported languages or English", () => {
  const inputs = [
    ["en-GB", "en"],
    ["es-MX", "es"],
    ["pt_BR", "pt-BR"],
    ["fr-CA", "fr"],
    ["de-AT", "de"],
    ["ru-RU", "ru"],
    ["ko-KR", "ko"],
    ["zh-CN", "zh-Hans"],
    ["zh-Hans-SG", "zh-Hans"],
    ["zh-Hant-TW", "en"],
    ["zh-HK", "en"],
    ["id-ID", "id"],
    ["hi-IN", "hi"],
    ["sv-SE", "en"],
    ["", "en"],
    [undefined, "en"],
  ];
  for (const [locale, expected] of inputs) assert.equal(resolveLocale(locale), expected);
});
