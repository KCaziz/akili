import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import { fetchProducts, resolveMediaUrl } from "../../lib/api";

export default function ProductsPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
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
  }, []);

  return (
    <Container className="section">
      <h1>{t("products.title")}</h1>
      <p className="lead">{t("products.lead")}</p>

      {status === "loading" && <p className="muted">{t("products.loading")}</p>}
      {status === "error" && <p className="notice">{t("products.error")}</p>}
      {status === "ready" && products.length === 0 && <p className="muted">{t("products.empty")}</p>}

      {status === "ready" && products.length > 0 && (
        <div className="card-grid">
          {products.map((product) => (
            <Link key={product.id} to={`/produits/${product.id}`} className="card-link">
              <Card>
                <img className="card-image" src={resolveMediaUrl(product.image)} alt={product.title} />
                <h3>{product.title}</h3>
                <p className="muted">{product.city} · {product.type === "VENTE" ? t("products.sale") : t("products.rent")}</p>
                <p className="price">{product.price}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
