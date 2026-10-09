import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import { fetchProduct, resolveMediaUrl } from "../../lib/api";

export default function ProductDetailPage() {
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
        <p className="muted">Chargement…</p>
      </Container>
    );
  }

  if (status === "error" || !product) {
    return (
      <Container className="section">
        <h1>Bien introuvable</h1>
        <p>Ce bien n'existe pas ou n'est plus disponible.</p>
        <Link to="/produits">Retour au catalogue</Link>
      </Container>
    );
  }

  return (
    <Container className="section">
      <Link to="/produits" className="back-link">&larr; Retour au catalogue</Link>

      <div className="product-detail">
        <img className="card-image large" src={resolveMediaUrl(product.image)} alt={product.title} />
        <div>
          <h1>{product.title}</h1>
          <p className="price">{product.price}</p>
          <ul className="product-meta">
            <li><strong>Type :</strong> {product.type === "VENTE" ? "Vente" : "Location"}</li>
            <li><strong>Ville :</strong> {product.city}</li>
            {product.rooms && <li><strong>Pièces :</strong> {product.rooms}</li>}
            {product.surface && <li><strong>Surface :</strong> {product.surface}</li>}
          </ul>
          {product.description && <p>{product.description}</p>}
          <Link to="/demande"><Button>Faire une demande sur ce bien</Button></Link>
        </div>
      </div>
    </Container>
  );
}
