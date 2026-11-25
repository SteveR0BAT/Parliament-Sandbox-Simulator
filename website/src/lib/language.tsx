"use client";
import { useCallback, useEffect, useState } from "react";
import dictionary from "@/data/translations";

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

export function translateText(value: string, language: Language): string {
  if (language === "en") return value;
  return dictionary[language]?.[value] ?? value;
}
