import assert from "node:assert/strict";
import test from "node:test";
import translations from "../src/data/translations";
import {
  BUILTIN_IDEOLOGIES,
  IDEOLOGY_FAMILIES,
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

test("all built-in ideology metadata and family descriptions are available in every locale", () => {
  const ideologyText = BUILTIN_IDEOLOGIES.flatMap((ideology) => [
    ideology.name,
    ideology.description,
    ideology.economic,
    ideology.social,
    ideology.note,
    ideology.history,
  ]).filter((value): value is string => Boolean(value));

  const familyText = IDEOLOGY_FAMILIES.flatMap((family) => [
    family.label,
    family.blurb,
  ]);

  const axisLabels = [
    "Economic orientation",
    "Social orientation",
    "Political authority",
    "Far Left",
    "Far Right",
    "Far Progressive",
    "Far Conservative",
    "Far Libertarian",
    "Far Authoritarian",
  ];

  const required = [...new Set([...ideologyText, ...familyText, ...axisLabels])];
  for (const locale of LOCALES) {
    for (const sourceText of required) {
      assert.ok(
        Object.prototype.hasOwnProperty.call(translations[locale], sourceText),
        `Locale ${locale} is missing ideology text: ${sourceText}`,
      );
    }
  }
});

test("known navigation, form, colour-picker and ideology-page controls are localised", () => {
  const required = [
    "Voting",
    "Add",
    "Clear",
    "Remove",
    "Classification note:",
    "Sources & references",
    "Type any format",
    "Suggested:",
    "Visual colour picker",
    "HEX colour",
    "The original ideology descriptions and historical metadata are preserved. Positions are broad reference classifications; political movements have varied across time and place.",
    "Unclassified custom ideologies",
    "No description.",
    "Used in this parliament",
    "assignment(s)",
    "Three-dimensional political profile",
    "An ideology needs a name.",
    "An ideology with this name already exists.",
    "Custom ideology saved.",
    "No ideologies match “",
    "”.",
    "Also: ",
    "Save ideology",
    "Cancel",
    "Edit custom ideology",
    "Create custom ideology",
  ];
  for (const locale of LOCALES) {
    for (const sourceText of required) {
      assert.ok(
        Object.prototype.hasOwnProperty.call(translations[locale], sourceText),
        `Locale ${locale} is missing UI text: ${sourceText}`,
      );
    }
  }
});
