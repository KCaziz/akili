// Google Analytics 4, chargé uniquement si :
//   1. un identifiant « G-XXXXXXXXXX » est renseigné dans Admin → Paramètres du site ;
//   2. le visiteur a accepté la mesure d'audience (bandeau de consentement).
// Sinon aucun script Google n'est chargé et aucun cookie n'est déposé.

const CONSENT_KEY = "akili_cookie_consent";
let activeId = null;

export function getConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY); // "granted" | "denied" | null
  } catch {
    return null;
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // stockage indisponible : le choix vaudra pour cette visite seulement
  }
  window.dispatchEvent(new CustomEvent("akili-consent", { detail: value }));
}

export function initAnalytics(measurementId) {
  if (!measurementId || activeId) return;
  activeId = measurementId;
  window.dataLayer = window.dataLayer || [];
  // gtag doit pousser l'objet « arguments » tel quel (format attendu par Google).
  window.gtag = function gtag() {
    window.dataLayer.push(arguments); // eslint-disable-line prefer-rest-params
  };
  window.gtag("js", new Date());
  // Pages vues envoyées à la main à chaque navigation (le site ne recharge pas la page).
  window.gtag("config", measurementId, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  // Clics de contact où qu'ils soient sur le site (bouton flottant, fiche bien, page Contact…).
  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (href.includes("wa.me/")) trackEvent("whatsapp_click", { page_path: window.location.pathname });
    else if (href.startsWith("mailto:")) trackEvent("email_click", { page_path: window.location.pathname });
    else if (href.startsWith("tel:")) trackEvent("phone_click", { page_path: window.location.pathname });
  });
}

export function trackPageView(lang) {
  if (!activeId) return;
  window.gtag("event", "page_view", {
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
    language: lang,
  });
}

// Conversions utiles à suivre dans GA4 : demandes envoyées, clics WhatsApp, etc.
export function trackEvent(name, params = {}) {
  if (!activeId) return;
  window.gtag("event", name, params);
}
