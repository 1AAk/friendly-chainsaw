import i18n, { type BackendModule, type ReadCallback } from "i18next";
import { initReactI18next } from "react-i18next";

const localeModules = import.meta.glob("./locales/*/*.json");

const STORAGE_KEY = "uiux-lang";

const normalizeLanguage = (lng?: string) => {
  if (!lng) {
    return "en";
  }

  return lng.toLowerCase().startsWith("ru") ? "ru" : "en";
};

const getInitialLanguage = () => {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return normalizeLanguage(stored);
  }

  const candidates = Array.isArray(navigator.languages)
    ? navigator.languages
    : [navigator.language];

  for (const candidate of candidates) {
    if (candidate && candidate.toLowerCase().startsWith("ru")) {
      return "ru";
    }
  }

  return "en";
};

type LocaleModule = { default: Record<string, unknown> };

type LocaleLoader = () => Promise<LocaleModule>;

const loadLocale = async (lng: string | undefined, ns: string) => {
  const normalized = normalizeLanguage(lng);
  const key = `./locales/${normalized}/${ns}.json`;
  const loader = localeModules[key] as LocaleLoader | undefined;

  if (!loader) {
    throw new Error(`Missing locale file: ${key}`);
  }

  const module = await loader();
  return module.default;
};

const backend: BackendModule = {
  type: "backend",
  init() {},
  read(language: string, namespace: string, callback: ReadCallback) {
    loadLocale(language, namespace)
      .then((resources) => callback(null, resources))
      .catch((error) => callback(error, false));
  },
};

i18n.use(backend).use(initReactI18next).init({
  ns: ["common"],
  defaultNS: "common",
  lng: getInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: ["en", "ru"],
  load: "languageOnly",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

const setDocumentLang = (lng: string) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
};

const persistLanguage = (lng: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, lng);
  }
};

setDocumentLang(normalizeLanguage(i18n.language));

i18n.on("languageChanged", (lng) => {
  const normalized = normalizeLanguage(lng);
  setDocumentLang(normalized);
  persistLanguage(normalized);
});

export default i18n;
