import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useFavorites } from "../../lib/favorites";
import { LocalLink } from "../../components/ui/LocalLink";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const { ids: favoriteIds } = useFavorites();
  const { pathname } = useLocation();

  // Ferme le menu mobile à chaque changement de page.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Ombre légère sous la barre dès qu'on fait défiler la page.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Échap ferme le menu mobile.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${menuOpen ? " menu-open" : ""}`}>
      <div className="container header-inner">
        <LocalLink to="/" className="brand" aria-label={`${t("header.brand")} ${t("header.brandSub")}`}>
          <svg className="brand-mark" viewBox="0 0 64 64" aria-hidden="true">
            <rect width="64" height="64" rx="14" />
            <path className="brand-mark-roof" d="M32 12 50 26v24a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V26z" />
            <path className="brand-mark-letter" d="M24 46 32 24l8 22M27 39h10" />
          </svg>
          <span className="brand-text">
            <span className="brand-name">{t("header.brand")}</span>
            <span className="brand-sub">{t("header.brandSub")}</span>
          </span>
        </LocalLink>

        <div id="main-menu" className={`nav-wrapper${menuOpen ? " open" : ""}`}>
          <Navigation onNavigate={() => setMenuOpen(false)} />
        </div>

        <div className="header-actions">
          <LocalLink
            to="/favoris"
            className="header-favorites"
            aria-label={`${t("favorites.navLabel")} (${favoriteIds.length})`}
            title={t("favorites.navLabel")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 4.4 2.5.8-1.4 2.3-2.5 4.4-2.5 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z" />
            </svg>
            {favoriteIds.length > 0 && <span className="header-favorites-count">{favoriteIds.length}</span>}
          </LocalLink>

          <LanguageSwitcher />

          <button
            type="button"
            className="burger"
            aria-label={t("header.openMenu")}
            aria-controls="main-menu"
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
