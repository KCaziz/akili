import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getConsent, setConsent } from "../../lib/analytics";

// Bandeau affiché seulement si la mesure d'audience est configurée et que le visiteur n'a pas encore choisi.
export default function CookieConsent({ enabled }) {
  const { t } = useTranslation();
  const [choice, setChoice] = useState(getConsent);

  useEffect(() => {
    const onChange = (event) => setChoice(event.detail);
    window.addEventListener("akili-consent", onChange);
    return () => window.removeEventListener("akili-consent", onChange);
  }, []);

  if (!enabled || choice) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label={t("cookies.title")}>
      <p>
        <strong>{t("cookies.title")}</strong> {t("cookies.text")}
      </p>
      <div className="cookie-consent-actions">
        <button type="button" className="btn btn-secondary" onClick={() => setConsent("denied")}>
          {t("cookies.refuse")}
        </button>
        <button type="button" className="btn btn-primary" onClick={() => setConsent("granted")}>
          {t("cookies.accept")}
        </button>
      </div>
    </div>
  );
}
