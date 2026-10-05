import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Présentation" },
  { to: "/services", label: "Services" },
  { to: "/produits", label: "Produits" },
  { to: "/vendre", label: "Vendre" },
  { to: "/demande", label: "Demande" },
  { to: "/contact", label: "Contact" },
];

export default function Navigation({ onNavigate }) {
  return (
    <nav className="main-nav">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
