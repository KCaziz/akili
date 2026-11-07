import { lazy, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "../../components/ui/Container";
import ProductCard from "../../components/products/ProductCard";
import FilterBar from "../../components/products/FilterBar";
import { FILTER_KEYS } from "../../lib/catalog";
import AlertForm from "../../components/products/AlertForm";
import { fetchProducts, fetchCities } from "../../lib/api";

const CatalogMap = lazy(() => import("../../components/maps/CatalogMap"));

const SORTS = ["newest", "price_asc", "price_desc"];

export default function ProductsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [cities, setCities] = useState([]);
  const [status, setStatus] = useState("loading");

  const filters = Object.fromEntries(FILTER_KEYS.map((key) => [key, searchParams.get(key) || ""]));
  const sort = SORTS.includes(searchParams.get("sort")) ? searchParams.get("sort") : "newest";
  const view = searchParams.get("vue") === "carte" ? "map" : "list";
  const queryKey = searchParams.toString();

  useEffect(() => {
    fetchCities().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    const params = Object.fromEntries(new URLSearchParams(queryKey));
    delete params.vue;
    fetchProducts(params)
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
  }, [queryKey]);

  function updateParams(changes) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setSearchParams(next, { replace: true });
  }

  return (
    <Container className="section">
      <h1>{t("products.title")}</h1>
      <p className="lead">{t("products.lead")}</p>

      {/* key : remet le formulaire à jour si les filtres changent depuis l'URL (retour arrière). */}
      <FilterBar key={queryKey} values={filters} cities={cities} onApply={updateParams} />

      <div className="catalog-toolbar">
        <span className="muted">{status === "ready" && t("products.resultCount", { count: products.length })}</span>
        <div className="catalog-toolbar-controls">
          <label className="sort-select">
            {t("filters.sort")}
            <select value={sort} onChange={(event) => updateParams({ sort: event.target.value === "newest" ? "" : event.target.value })}>
              <option value="newest">{t("filters.sortNewest")}</option>
              <option value="price_asc">{t("filters.sortPriceAsc")}</option>
              <option value="price_desc">{t("filters.sortPriceDesc")}</option>
            </select>
          </label>
          <div className="view-toggle" role="group" aria-label={t("products.viewLabel")}>
            <button type="button" className={view === "list" ? "active" : ""} aria-pressed={view === "list"} onClick={() => updateParams({ vue: "" })}>
              {t("products.viewList")}
            </button>
            <button type="button" className={view === "map" ? "active" : ""} aria-pressed={view === "map"} onClick={() => updateParams({ vue: "carte" })}>
              {t("products.viewMap")}
            </button>
          </div>
        </div>
      </div>

      {status === "loading" && <p className="muted">{t("products.loading")}</p>}
      {status === "error" && <p className="notice">{t("products.error")}</p>}
      {status === "ready" && products.length === 0 && <p className="muted">{t("products.noResults")}</p>}

      {status === "ready" && products.length > 0 && view === "list" && (
        <div className="card-grid">
          {products.map((product) => (
            <div key={product.id} className="reveal">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {status === "ready" && products.length > 0 && view === "map" && (
        <Suspense fallback={<p className="muted">{t("products.loading")}</p>}>
          <CatalogMap products={products} />
        </Suspense>
      )}

      <AlertForm criteria={filters} />
    </Container>
  );
}
