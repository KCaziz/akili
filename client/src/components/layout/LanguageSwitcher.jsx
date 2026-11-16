import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../../i18n";
import { switchLangInPath } from "../../lib/paths";

// Changer de langue = aller à la même page dans l'autre langue (/fr/contact → /ar/contact).
export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  function handleChange(event) {
    const lang = event.target.value;
    i18n.changeLanguage(lang);
    navigate(switchLangInPath(`${location.pathname}${location.search}`, lang));
  }

  return (
    <select className="language-switcher" aria-label={t("language.label")} value={i18n.language} onChange={handleChange}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code} lang={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
