import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import { fetchProducts, resolveMediaUrl } from "../../lib/api";

export default function ProductsPage() {
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
      <h1>Nos produits</h1>
      <p className="lead">Découvrez notre sélection de biens à la vente et à la location.</p>

      {status === "loading" && <p className="muted">Chargement des produits…</p>}
      {status === "error" && (
        <p className="notice">Impossible de charger les produits. Le serveur est-il démarré ?</p>
      )}
      {status === "ready" && products.length === 0 && (
        <p className="muted">Aucun produit n'est disponible pour le moment.</p>
      )}

      {status === "ready" && products.length > 0 && (
        <div className="card-grid">
          {products.map((product) => (
            <Link key={product.id} to={`/produits/${product.id}`} className="card-link">
              <Card>
                <img className="card-image" src={resolveMediaUrl(product.image)} alt={product.title} />
                <h3>{product.title}</h3>
                <p className="muted">{product.city} · {product.type === "VENTE" ? "Vente" : "Location"}</p>
                <p className="price">{product.price}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
