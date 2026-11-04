import { useTranslation } from "react-i18next";
import { isNewProduct } from "../../lib/format";

export default function ProductBadges({ product }) {
  const { t } = useTranslation();
  const badges = [];
  if (product.status === "VENDU") badges.push({ key: "sold", tone: "closed" });
  if (product.status === "LOUE") badges.push({ key: "rented", tone: "closed" });
  if (product.isExclusive) badges.push({ key: "exclusive", tone: "exclusive" });
  if (product.status === "DISPONIBLE" && isNewProduct(product)) badges.push({ key: "new", tone: "new" });
  if (!badges.length) return null;

  return (
    <div className="product-badges">
      {badges.map((badge) => (
        <span key={badge.key} className={`product-badge product-badge-${badge.tone}`}>
          {t(`badges.${badge.key}`)}
        </span>
      ))}
    </div>
  );
}
