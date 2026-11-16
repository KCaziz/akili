import { Suspense, useEffect } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AssistantWidget from "../components/assistant/AssistantWidget";
import WhatsAppFloat from "../components/layout/WhatsAppFloat";
import CookieConsent from "../components/layout/CookieConsent";
import ScrollReveal from "../components/ui/ScrollReveal";
import NotFoundPage from "../pages/NotFoundPage";
import { DEFAULT_LANG, PAGE_SEGMENTS, isLang } from "../lib/paths";
import { fetchSeo } from "../lib/api";
import { useSiteSettings } from "../lib/useSiteSettings";
import { getConsent, initAnalytics, trackPageView } from "../lib/analytics";

function setHeadTag(selector, create, attribute, value) {
  let element = document.head.querySelector(selector);
  if (!value) {
    element?.remove();
    return;
  }
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

// Titre, description, canonique et robots à jour à chaque navigation (même source que le serveur).
function applySeo(seo) {
  if (!seo?.title) return;
  document.title = seo.title;
  const meta = (name) => () => Object.assign(document.createElement("meta"), { name });
  setHeadTag('meta[name="description"]', meta("description"), "content", seo.description);
  setHeadTag('meta[name="robots"]', meta("robots"), "content", seo.robots);
  setHeadTag('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }), "href", seo.canonical);
}

export default function MainLayout() {
  const { lang } = useParams();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const { gaMeasurementId } = useSiteSettings();
  const validLang = isLang(lang);

  // Retour arrière / lien direct vers une autre langue : l'interface suit l'adresse.
  useEffect(() => {
    if (validLang && i18n.language !== lang) i18n.changeLanguage(lang);
  }, [validLang, lang, i18n]);

  // Mesure d'audience : chargée dès que le visiteur accepte (et seulement s'il accepte).
  useEffect(() => {
    if (!gaMeasurementId) return undefined;
    if (getConsent() === "granted") initAnalytics(gaMeasurementId);
    const onConsent = (event) => {
      if (event.detail !== "granted") return;
      initAnalytics(gaMeasurementId);
      trackPageView(i18n.language);
    };
    window.addEventListener("akili-consent", onConsent);
    return () => window.removeEventListener("akili-consent", onConsent);
  }, [gaMeasurementId, i18n]);

  useEffect(() => {
    if (!validLang) return undefined;
    let cancelled = false;
    fetchSeo(`${location.pathname}${location.search}`)
      .then((seo) => !cancelled && applySeo(seo))
      .catch(() => {})
      .finally(() => !cancelled && trackPageView(lang));
    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search, validLang, lang]);

  // Ancienne adresse sans langue (/produits/...) : on la redirige vers la version française.
  if (!validLang && PAGE_SEGMENTS.includes(lang)) {
    return <Navigate to={`/${DEFAULT_LANG}${location.pathname}${location.search}`} replace />;
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">{t("a11y.skipToContent")}</a>
      <Header />
      <main className="main-content" id="main" tabIndex={-1}>
        <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
          {validLang ? <Outlet /> : <NotFoundPage />}
        </Suspense>
      </main>
      <Footer />
      <AssistantWidget />
      <WhatsAppFloat />
      <CookieConsent enabled={Boolean(gaMeasurementId)} />
      <ScrollReveal />
    </div>
  );
}
