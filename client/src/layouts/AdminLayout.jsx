import { useState } from "react";
import { NavLink, Outlet, Link, Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import AdminIcon from "../components/admin/AdminIcon";

const sections = [
  {
    title: "Général",
    links: [{ to: "/admin", label: "Tableau de bord", icon: "dashboard", end: true }],
  },
  {
    title: "Contenu du site",
    links: [
      { to: "/admin/produits", label: "Produits", icon: "building" },
      { to: "/admin/services", label: "Services", icon: "briefcase" },
      { to: "/admin/galerie", label: "Galerie", icon: "image" },
      { to: "/admin/avis", label: "Avis clients", icon: "star" },
    ],
  },
  {
    title: "Clients",
    links: [
      { to: "/admin/demandes", label: "Demandes clients", icon: "inbox" },
      { to: "/admin/offres", label: "Offres de vente", icon: "tag" },
      { to: "/admin/alertes", label: "Alertes visiteurs", icon: "bell" },
    ],
  },
  {
    title: "Paramètres",
    links: [
      { to: "/admin/parametres", label: "Paramètres du site", icon: "settings" },
      { to: "/admin/compte", label: "Mon compte", icon: "user" },
    ],
  },
];

const todayLabel = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());

export default function AdminLayout() {
  const { status, admin, logout } = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  if (status === "checking") {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
      </div>
    );
  }

  if (status === "anonymous") {
    return <Navigate to="/admin/connexion" replace />;
  }

  const initial = (admin?.username || "A").charAt(0).toUpperCase();

  return (
    <div className={`admin-shell ${menuOpen ? "admin-menu-open" : ""}`}>
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand" onClick={() => setMenuOpen(false)}>
          <span className="admin-brand-logo">A</span>
          <span className="admin-brand-text">
            Akili <small>Administration</small>
          </span>
        </Link>

        <nav className="admin-nav">
          {sections.map((section) => (
            <div key={section.title} className="admin-nav-section">
              <p className="admin-nav-title">{section.title}</p>
              {section.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? "admin-nav-link active" : "admin-nav-link")}
                >
                  <AdminIcon name={link.icon} />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-user-card">
          <span className="admin-avatar">{initial}</span>
          <div className="admin-user-info">
            <strong>{admin?.username}</strong>
            <span>Administrateur</span>
          </div>
          <button type="button" className="admin-icon-btn" onClick={logout} title="Se déconnecter" aria-label="Se déconnecter">
            <AdminIcon name="logout" />
          </button>
        </div>
      </aside>

      <div className="admin-backdrop" onClick={() => setMenuOpen(false)} />

      <div className="admin-main">
        <header className="admin-topbar">
          <button type="button" className="admin-icon-btn admin-burger" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
            <AdminIcon name="menu" size={20} />
          </button>
          <p className="admin-topbar-date">{todayLabel}</p>
          <a className="admin-site-link" href="/" target="_blank" rel="noreferrer">
            <AdminIcon name="external" size={16} />
            <span>Voir le site</span>
          </a>
        </header>

        <main className="admin-content" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
