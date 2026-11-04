import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Card from "../ui/Card";
import ProductBadges from "./ProductBadges";
import FavoriteButton from "./FavoriteButton";
import { resolveMediaUrl } from "../../lib/api";
import { formatProductPrice, productImages } from "../../lib/format";

export default function ProductCard({ product }) {
  const { t } = useTranslation();
  const images = productImages(product);
  const closed = product.status !== "DISPONIBLE";

  return (
    <Link to={`/produits/${product.id}`} className="card-link">
      <Card className={`product-card ${closed ? "is-closed" : ""}`}>
        <div className="product-card-media">
          {images[0] ? (
            <img className="card-image" src={resolveMediaUrl(images[0])} alt={product.title} loading="lazy" />
          ) : (
            <div className="card-image card-image-empty" />
          )}
          <ProductBadges product={product} />
          <FavoriteButton productId={product.id} />
          {images.length > 1 && <span className="photo-count">{t("productDetail.photoCount", { count: images.length })}</span>}
        </div>
        <h3 dir="auto">{product.title}</h3>
        <p className="muted">
          <bdi>{product.city}</bdi> · {product.type === "VENTE" ? t("products.sale") : t("products.rent")}
          {product.rooms ? ` · ${t("products.roomsShort", { count: product.rooms })}` : ""}
          {product.surface && <> · <bdi>{product.surface}</bdi></>}
        </p>
        <p className="price">{formatProductPrice(product, t)}</p>
      </Card>
    </Link>
  );
}
