import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const links = [
  { to: "/", key: "presentation" },
  { to: "/services", key: "services" },
  { to: "/produits", key: "products" },
  { to: "/galerie", key: "gallery" },
  { to: "/vendre", key: "sell" },
  { to: "/demande", key: "request" },
  { to: "/contact", key: "contact" },
];

export default function Navigation({ onNavigate }) {
  const { t } = useTranslation();

  return (
    <nav className="main-nav">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          {t(`nav.${link.key}`)}
        </NavLink>
      ))}
    </nav>
  );
}
