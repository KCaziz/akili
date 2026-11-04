import { useSyncExternalStore } from "react";

// Favoris stockés dans le navigateur du visiteur (pas de compte visiteur).
const STORAGE_KEY = "akili_favorites";
const listeners = new Set();
let cache = read();

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(ids) {
  cache = ids;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Stockage indisponible (navigation privée) : les favoris restent valables pour la session.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) {
      cache = read();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, () => cache);
  return {
    ids,
    isFavorite: (id) => ids.includes(id),
    toggle: (id) => write(ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]),
  };
}
