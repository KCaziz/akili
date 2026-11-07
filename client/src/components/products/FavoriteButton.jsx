import { useTranslation } from "react-i18next";
import { useFavorites } from "../../lib/favorites";

export default function FavoriteButton({ productId, className = "" }) {
  const { t } = useTranslation();
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(productId);
  const label = active ? t("favorites.remove") : t("favorites.add");

  return (
    <button
      type="button"
      className={`favorite-btn ${active ? "active" : ""} ${className}`}
      aria-pressed={active}
      aria-label={label}
      title={label}
      onClick={(event) => {
        // Le bouton est posé sur une carte cliquable : on ne veut pas ouvrir la fiche.
        event.preventDefault();
        event.stopPropagation();
        toggle(productId);
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 4.4 2.5.8-1.4 2.3-2.5 4.4-2.5 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z" />
      </svg>
    </button>
  );
}
