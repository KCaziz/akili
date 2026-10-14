import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./locales/fr.json";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import tzm from "./locales/tzm.json";

export const SUPPORTED_LANGUAGES = [
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "tzm", label: "Tamazight", dir: "ltr" },
];

const STORAGE_KEY = "akili_lang";

function getStoredLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED_LANGUAGES.some((lang) => lang.code === stored)) return stored;
  } catch {
    // localStorage indisponible (navigation privée, etc.) : on retombe sur le défaut.
  }
  return "fr";
}

export function applyDocumentDirection(langCode) {
  const lang = SUPPORTED_LANGUAGES.find((item) => item.code === langCode) || SUPPORTED_LANGUAGES[0];
  document.documentElement.lang = lang.code;
  document.documentElement.dir = lang.dir;
}

i18n.use(initReactI18next).init({
  resources: { fr: { translation: fr }, en: { translation: en }, ar: { translation: ar }, tzm: { translation: tzm } },
  lng: getStoredLanguage(),
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // Pas grave si on ne peut pas persister la préférence.
  }
  applyDocumentDirection(lng);
});

applyDocumentDirection(i18n.language);

export default i18n;
