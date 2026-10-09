import { NavLink, Outlet, Link, Navigate } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";

const links = [
  { to: "/admin", label: "Tableau de bord", end: true },
  { to: "/admin/produits", label: "Produits" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/galerie", label: "Galerie" },
  { to: "/admin/demandes", label: "Demandes clients" },
  { to: "/admin/offres", label: "Offres de vente" },
  { to: "/admin/compte", label: "Mon compte" },
];

export default function AdminLayout() {
  const { status, admin, logout } = useAdminAuth();

  if (status === "checking") {
    return <div className="admin-login"><p style={{ color: "#fff" }}>Chargement…</p></div>;
  }

  if (status === "anonymous") {
    return <Navigate to="/admin/connexion" replace />;
  }

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
        <p className="admin-exit" style={{ marginBottom: 8 }}>Connecté : {admin?.username}</p>
        <button type="button" className="admin-exit" style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }} onClick={logout}>
          Se déconnecter
        </button>
        <Link to="/" className="admin-exit" style={{ marginTop: 8 }}>&larr; Retour au site</Link>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
