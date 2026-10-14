import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../../i18n";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <select
      className="language-switcher"
      aria-label={t("language.label")}
      value={i18n.language}
      onChange={(event) => i18n.changeLanguage(event.target.value)}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
