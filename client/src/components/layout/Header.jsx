import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          Akili <span className="brand-sub">Immobilier</span>
        </Link>

        <button
          className="burger"
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-wrapper ${menuOpen ? "open" : ""}`}>
          <Navigation onNavigate={() => setMenuOpen(false)} />
        </div>
      </div>
    </header>
  );
}
