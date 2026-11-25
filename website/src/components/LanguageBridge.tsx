"use client";
import { useEffect } from "react";
import { translateText, useLanguage } from "@/lib/language";

type TextState = { original: string; applied: string };
type AttributeState = { original: string; applied: string };
const textStates = new WeakMap<Text, TextState>();
const attributeStates = new WeakMap<Element, Map<string, AttributeState>>();
const TRANSLATABLE_ATTRIBUTES = ["title", "placeholder", "aria-label", "alt"];

function translateTextNode(node: Text, language: ReturnType<typeof useLanguage>["language"]) {
  const raw = node.nodeValue ?? "";
  const trimmed = raw.trim();
  if (!trimmed) return;

  const previous = textStates.get(node);
  const original = previous && raw === previous.applied ? previous.original : trimmed;
  const translated = translateText(original, language);
  const start = raw.indexOf(trimmed);
  const next = raw.slice(0, start) + translated + raw.slice(start + trimmed.length);
  textStates.set(node, { original, applied: next });
  if (raw !== next) node.nodeValue = next;
}

function translateAttribute(element: Element, name: string, language: ReturnType<typeof useLanguage>["language"]) {
  const raw = element.getAttribute(name);
  if (raw === null || !raw.trim()) return;
  let states = attributeStates.get(element);
  if (!states) {
    states = new Map<string, AttributeState>();
    attributeStates.set(element, states);
  }
  const previous = states.get(name);
  const original = previous && raw === previous.applied ? previous.original : raw;
  const translated = translateText(original, language);
  states.set(name, { original, applied: translated });
  if (raw !== translated) element.setAttribute(name, translated);
}

function translateTree(root: Node, language: ReturnType<typeof useLanguage>["language"]) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, language);
    return;
  }
  if (root instanceof Element) {
    for (const name of TRANSLATABLE_ATTRIBUTES) translateAttribute(root, name, language);
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    translateTextNode(current as Text, language);
    current = walker.nextNode();
  }
  if (root instanceof Element) {
    for (const element of root.querySelectorAll("*")) {
      for (const name of TRANSLATABLE_ATTRIBUTES) translateAttribute(element, name, language);
    }
  }
}

export function LanguageBridge() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
    if (!document.body) return;
    translateTree(document.body, language);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData" && record.target.nodeType === Node.TEXT_NODE) {
          translateTextNode(record.target as Text, language);
        } else if (record.type === "attributes" && record.target instanceof Element && record.attributeName) {
          translateAttribute(record.target, record.attributeName, language);
        } else if (record.type === "childList") {
          for (const added of record.addedNodes) translateTree(added, language);
        }
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATABLE_ATTRIBUTES,
    });
    return () => observer.disconnect();
  }, [language]);

  return null;
}
