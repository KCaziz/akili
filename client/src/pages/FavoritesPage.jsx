import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import ProductCard from "../components/products/ProductCard";
import { fetchProducts } from "../lib/api";
import { useFavorites } from "../lib/favorites";

export default function FavoritesPage() {
  const { t } = useTranslation();
  const { ids } = useFavorites();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const idsKey = ids.join(",");

  useEffect(() => {
    if (!idsKey) return undefined;
    let cancelled = false;
    fetchProducts({ ids: idsKey })
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setStatus("ready");
        }
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  // Un bien retiré des favoris disparaît tout de suite, sans attendre un nouvel appel.
  const visible = idsKey ? products.filter((product) => ids.includes(product.id)) : [];

  return (
    <Container className="section">
      <h1>{t("favorites.title")}</h1>
      <p className="lead">{t("favorites.lead")}</p>

      {idsKey && status === "loading" && <p className="muted">{t("products.loading")}</p>}
      {idsKey && status === "error" && <p className="notice">{t("products.error")}</p>}

      {(!idsKey || (status === "ready" && visible.length === 0)) && (
        <div className="empty-state">
          <p>{t("favorites.empty")}</p>
          <Link to="/produits"><Button>{t("favorites.browse")}</Button></Link>
        </div>
      )}

      {visible.length > 0 && (
        <div className="card-grid">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </Container>
  );
}
