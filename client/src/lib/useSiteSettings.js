import { useEffect, useState } from "react";
import { fetchSettings } from "./api";

// Le numéro WhatsApp de repli tant que les paramètres ne sont pas chargés.
const DEFAULT_SETTINGS = { yearsExperience: "", propertiesSold: "", clientsServed: "", whatsappNumber: "213783940376", contactEmail: "contact@akili-immobilier.com" };
let pending = null;

function loadSettings() {
  pending ??= fetchSettings()
    .then((settings) => ({ ...DEFAULT_SETTINGS, ...settings }))
    .catch(() => {
      pending = null;
      return DEFAULT_SETTINGS;
    });
  return pending;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  useEffect(() => {
    let cancelled = false;
    loadSettings().then((value) => !cancelled && setSettings(value));
    return () => {
      cancelled = true;
    };
  }, []);
  return settings;
}
