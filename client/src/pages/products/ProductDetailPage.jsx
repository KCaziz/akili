import { lazy, Suspense, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import ImageGallery from "../../components/products/ImageGallery";
import ProductBadges from "../../components/products/ProductBadges";
import FavoriteButton from "../../components/products/FavoriteButton";
import ShareButtons from "../../components/products/ShareButtons";
import VideoTour from "../../components/products/VideoTour";
import MortgageSimulator from "../../components/products/MortgageSimulator";
import { fetchProduct, recordProductView } from "../../lib/api";
import { formatProductPrice, productImages } from "../../lib/format";
import { useSiteSettings } from "../../lib/useSiteSettings";

const ProductMap = lazy(() => import("../../components/maps/ProductMap"));

// Une consultation comptée par bien et par session de navigation.
function countViewOnce(id) {
  const key = `akili_viewed_${id}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // sessionStorage indisponible : on compte quand même.
  }
  recordProductView(id).catch(() => {});
}

export default function ProductDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { whatsappNumber } = useSiteSettings();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [loadedId, setLoadedId] = useState(id);

  // Changement de bien sans démonter la page (lien interne) : on repasse en chargement.
  if (loadedId !== id) {
    setLoadedId(id);
    setStatus("loading");
  }

  useEffect(() => {
    let cancelled = false;
    fetchProduct(id)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          setStatus("ready");
          countViewOnce(id);
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

  const price = formatProductPrice(product, t);
  const available = product.status === "DISPONIBLE";
  const hasLocation = product.latitude !== null && product.longitude !== null;
  const whatsappText = t("whatsapp.propertyMessage", { title: product.title, url: window.location.href });

  return (
    <Container className="section">
      <Link to="/produits" className="back-link">&larr; {t("productDetail.backToCatalog")}</Link>

      <div className="product-detail">
        <ImageGallery key={product.id} images={productImages(product)} alt={product.title} />
        <div>
          <ProductBadges product={product} />
          <div className="product-title-row">
            <h1 dir="auto">{product.title}</h1>
            <FavoriteButton productId={product.id} className="favorite-btn-inline" />
          </div>
          <p className="price">{price}</p>
          {/* Contenu saisi par l'agence (souvent en français) : bdi/dir="auto" pour qu'il garde son
              sens de lecture dans l'interface arabe. */}
          <ul className="product-meta">
            <li><strong>{t("productDetail.type")}</strong> {product.type === "VENTE" ? t("products.sale") : t("products.rent")}</li>
            <li><strong>{t("productDetail.city")}</strong> <bdi>{product.city}</bdi></li>
            {product.rooms && <li><strong>{t("productDetail.rooms")}</strong> {product.rooms}</li>}
            {product.surface && <li><strong>{t("productDetail.surface")}</strong> <bdi>{product.surface}</bdi></li>}
          </ul>
          {product.description && <p className="preserve-lines" dir="auto">{product.description}</p>}
          <div className="product-actions">
            <Link to="/demande"><Button>{t("productDetail.requestOnThis")}</Button></Link>
            {whatsappNumber && (
              <a
                className="btn btn-whatsapp"
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`}
                target="_blank"
                rel="noreferrer"
              >
                {t("productDetail.askOnWhatsapp")}
              </a>
            )}
          </div>
          <ShareButtons title={product.title} price={price} />
        </div>
      </div>

      {product.videos?.length > 0 && (
        <section className="product-section reveal">
          <h2>{product.videos.length > 1 ? t("productDetail.videosTitle") : t("productDetail.video")}</h2>
          <div className={product.videos.length > 1 ? "video-list" : undefined}>
            {product.videos.map((video) => (
              <VideoTour key={video.id} url={video.url} title={product.title} />
            ))}
          </div>
        </section>
      )}

      {hasLocation && (
        <section className="product-section reveal">
          <h2>{t("productDetail.location")}</h2>
          <Suspense fallback={<p className="muted">{t("productDetail.loading")}</p>}>
            <ProductMap latitude={product.latitude} longitude={product.longitude} />
          </Suspense>
        </section>
      )}

      {product.type === "VENTE" && available && product.priceValue && (
        <section className="product-section reveal">
          <h2>{t("simulator.title")}</h2>
          <p className="muted">{t("simulator.lead")}</p>
          <MortgageSimulator key={product.id} initialPrice={product.priceValue} />
        </section>
      )}
    </Container>
  );
}
