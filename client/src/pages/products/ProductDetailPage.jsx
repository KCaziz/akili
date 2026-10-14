import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import { fetchProduct, resolveMediaUrl } from "../../lib/api";

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchProduct(id)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          setStatus("ready");
        }
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <Container className="section">
        <p className="muted">{t("productDetail.loading")}</p>
      </Container>
    );
  }

  if (status === "error" || !product) {
    return (
      <Container className="section">
        <h1>{t("productDetail.notFoundTitle")}</h1>
        <p>{t("productDetail.notFoundText")}</p>
        <Link to="/produits">{t("productDetail.backToCatalog")}</Link>
      </Container>
    );
  }

  return (
    <Container className="section">
      <Link to="/produits" className="back-link">&larr; {t("productDetail.backToCatalog")}</Link>

      <div className="product-detail">
        <img className="card-image large" src={resolveMediaUrl(product.image)} alt={product.title} />
        <div>
          <h1>{product.title}</h1>
          <p className="price">{product.price}</p>
          <ul className="product-meta">
            <li><strong>{t("productDetail.type")}</strong> {product.type === "VENTE" ? t("products.sale") : t("products.rent")}</li>
            <li><strong>{t("productDetail.city")}</strong> {product.city}</li>
            {product.rooms && <li><strong>{t("productDetail.rooms")}</strong> {product.rooms}</li>}
            {product.surface && <li><strong>{t("productDetail.surface")}</strong> {product.surface}</li>}
          </ul>
          {product.description && <p className="preserve-lines">{product.description}</p>}
          <Link to="/demande"><Button>{t("productDetail.requestOnThis")}</Button></Link>
        </div>
      </div>
    </Container>
  );
}
