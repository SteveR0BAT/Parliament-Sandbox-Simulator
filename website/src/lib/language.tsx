"use client";
import { useCallback, useEffect, useState } from "react";
import dictionary from "@/data/translations";
import runtimeTranslations from "@/data/runtimeTranslations";
import ideologyTextTranslations from "@/data/ideologyTextTranslations";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "zh-CN", label: "简体中文" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ka", label: "ქართული" },
  { code: "es", label: "Español" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
] as const;

export type Language = (typeof LANGUAGES)[number]["code"];
const STORAGE_KEY = "parliament-sandbox:language";
const LANGUAGE_EVENT = "parliament-sandbox:language-change";

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const readStoredLanguage = () => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (LANGUAGES.some((item) => item.code === saved)) {
          setLanguageState(saved as Language);
        }
      } catch {
        // Keep English when browser storage is unavailable.
      }
    };
    readStoredLanguage();
    window.addEventListener(LANGUAGE_EVENT, readStoredLanguage);
    window.addEventListener("storage", readStoredLanguage);
    return () => {
      window.removeEventListener(LANGUAGE_EVENT, readStoredLanguage);
      window.removeEventListener("storage", readStoredLanguage);
    };
  }, []);

  const setLanguage = useCallback((next: Language) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The selection still applies for the current session.
    }
    setLanguageState(next);
    window.dispatchEvent(new Event(LANGUAGE_EVENT));
  }, []);

  return { language, setLanguage };
}

const COMPOSITE_TRANSLATION_KEYS = [
  "Delete project “",
  "” permanently?",
  "Delete issue “",
  "”? Past votes stay in the history.",
  "no faction decision → party line",
  "no faction → party line",
  " deputies and factions will be removed and seats become unallocated.",
  "Could not create voting issue:",
  "Could not load browser project storage:",
  "Created ",
  "Imported “",
  "”.",
  "? Its ",
  "Delete ",
  "Merge the selected parties into the target? This cannot be undone.",
  "Restore this snapshot? The current project will first be saved as a recovery snapshot.",
  "Delete this vote from history?",
  "Reset ALL appearance, geometry and default settings of this project? Parties and votes are kept.",
  "no rule configured",
  "has no configured position",
  "no ideology assigned",
  "no decision set",
  "individual decision",
  "individual mode",
  "random draw",
  "absence roll",
  "abstention roll",
  "ignores guidance",
  "mixed rule",
  "Strongly Against",
  "Mostly Against",
  "Strongly For",
  "Mostly For",
  "Simple majority",
  "Two-thirds majority",
  "Three-fifths majority",
  "Custom rule",
  "valid votes (For + Against)",
  "deputies present",
  "all seats",
  "present /",
  "required —",
  "✓ met",
  "✗ NOT met",
  "For (have",
  ", base",
  ": needs",
  "Quorum:",
  "P for",
  "at least",
  "more than",
  "breaks from",
  "follows",
  "discipline",
  "adherence",
  "no rule",
  "independent",
  "behaviour",
  "ideology",
  "faction",
  "party",
  "group",
  "line",
  "randomness",
  "fixed",
  "default",
  "via",
  "For",
  "Against",
  "Abstain",
  "Absent",
  "Vote:",
  "Normalised:",
] as const;;;

function escapeRegExp(value: string): string {
  const special = new Set([".", "*", "+", "?", "^", "$", "{", "}", "(", ")", "|", "[", "]", "\\"]);
  return value.split("").map((character) => special.has(character) ? `\\${character}` : character).join("");
}

export function translateText(value: string, language: Language): string {
  if (language === "en") return value;

  const exact =
    dictionary[language]?.[value] ??
    runtimeTranslations[value]?.[language] ??
    ideologyTextTranslations[value]?.[language];
  if (exact !== undefined) return exact;

  // Translate known fragments in dynamically composed vote explanations while
  // leaving names, percentages and other user-supplied content unchanged.
  let translated = value;
  for (const source of COMPOSITE_TRANSLATION_KEYS) {
    const replacement = runtimeTranslations[source]?.[language];
    if (!replacement) continue;
    const pattern = new RegExp(`(?<![A-Za-z0-9_])${escapeRegExp(source)}(?![A-Za-z0-9_])`, "g");
    translated = translated.replace(pattern, replacement);
  }
  return translated;
}
