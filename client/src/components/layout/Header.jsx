import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navigation from "./Navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

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
