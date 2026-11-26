import assert from "node:assert/strict";
import test from "node:test";
import translations from "../src/data/translations";
import {
  BUILTIN_IDEOLOGIES,
  IDEOLOGY_FAMILY_MAP,
  formatAxisPosition,
} from "../src/data/ideologies";

const LOCALES = ["en", "ru", "de", "fr", "zh-CN", "id", "ka", "es", "ja", "ko"] as const;

test("every locale contains the same complete translation-key set", () => {
  const expected = Object.keys(translations.en).sort();
  for (const locale of LOCALES) {
    assert.deepEqual(
      Object.keys(translations[locale]).sort(),
      expected,
      `Locale ${locale} has a different translation-key set`,
    );
  }
});

test("all built-in ideology metadata is available in every locale", () => {
  const ideologyText = BUILTIN_IDEOLOGIES.flatMap((ideology) => [
    ideology.name,
    ideology.description,
    ideology.economic,
    ideology.social,
    ideology.note,
    ideology.history,
  ]).filter((value): value is string => Boolean(value));

  const familyText = Object.values(IDEOLOGY_FAMILY_MAP).flatMap((family) => [
    family.label,
    family.blurb,
  ]);

  const axisText = (["economic", "social", "authority"] as const).flatMap((axis) => [
    ...([-3, -2, -1, 0, 1, 2, 3] as const).map((value) => formatAxisPosition(axis, value)),
    formatAxisPosition(axis, null),
  ]);

  const required = [...new Set([...ideologyText, ...familyText, ...axisText])];
  for (const locale of LOCALES) {
    for (const sourceText of required) {
      assert.ok(
        Object.hasOwn(translations[locale], sourceText),
        `Locale ${locale} is missing ideology text: ${sourceText}`,
      );
    }
  }
});

test("previously untranslated controls have entries in every locale", () => {
  const required = [
    "Voting",
    "Classification note",
    "Type any format",
    "Suggested:",
    "Visual colour picker",
    "HEX colour",
    "▶ Run vote",
  ];
  for (const locale of LOCALES) {
    for (const sourceText of required) {
      assert.ok(
        Object.hasOwn(translations[locale], sourceText),
        `Locale ${locale} is missing UI text: ${sourceText}`,
      );
    }
  }
});
