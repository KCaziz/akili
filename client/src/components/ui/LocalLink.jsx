import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { localizePath } from "../../lib/paths";

// Liens internes du site public : ajoutent automatiquement la langue courante (/fr/…, /ar/…).
export function useLocalizePath() {
  const { i18n } = useTranslation();
  return (path) => localizePath(path, i18n.language);
}

export function LocalLink({ to, ...props }) {
  const localize = useLocalizePath();
  return <Link to={localize(to)} {...props} />;
}

export function LocalNavLink({ to, ...props }) {
  const localize = useLocalizePath();
  return <NavLink to={localize(to)} {...props} />;
}
