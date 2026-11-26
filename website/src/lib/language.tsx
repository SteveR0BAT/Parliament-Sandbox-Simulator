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
  "no rule configured",
  "individual decision",
  "random draw",
  "fixed",
  "via",
  "adherence",
  "P for",
  "follows",
  "breaks from",
  "line",
  "discipline",
  "at least",
  "more than",
  "all seats",
  "deputies present",
  "valid votes (For + Against)",
  "Vote:",
  "Normalised:",
] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&");
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
    const pattern = new RegExp(
      `(?<![\\\\p{L}\\\\p{N}_])${escapeRegExp(source)}(?![\\\\p{L}\\\\p{N}_])`,
      "gu",
    );
    translated = translated.replace(pattern, replacement);
  }
  return translated;
}
