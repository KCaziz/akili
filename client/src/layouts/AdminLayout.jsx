import { NavLink, Outlet, Link } from "react-router-dom";

const links = [
  { to: "/admin", label: "Tableau de bord", end: true },
  { to: "/admin/produits", label: "Produits & services" },
  { to: "/admin/demandes", label: "Demandes clients" },
  { to: "/admin/offres", label: "Offres de vente" },
];

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">Akili <span>Admin</span></Link>
        <nav className="admin-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "admin-nav-link active" : "admin-nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="admin-exit">&larr; Retour au site</Link>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
