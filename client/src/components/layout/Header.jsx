import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navigation from "./Navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useFavorites } from "../../lib/favorites";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { ids: favoriteIds } = useFavorites();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          {t("header.brand")} <span className="brand-sub">{t("header.brandSub")}</span>
        </Link>

        <div className="header-actions">
          <div className={`nav-wrapper ${menuOpen ? "open" : ""}`}>
            <Navigation onNavigate={() => setMenuOpen(false)} />
          </div>

          <Link
            to="/favoris"
            className="header-favorites"
            aria-label={`${t("favorites.navLabel")} (${favoriteIds.length})`}
            title={t("favorites.navLabel")}
            onClick={() => setMenuOpen(false)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 4.4 2.5.8-1.4 2.3-2.5 4.4-2.5 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z" />
            </svg>
            {favoriteIds.length > 0 && <span className="header-favorites-count">{favoriteIds.length}</span>}
          </Link>

          <LanguageSwitcher />

          <button
            className="burger"
            aria-label={t("header.openMenu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
