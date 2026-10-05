import { useParams, Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import { mockProducts } from "../../data/mockProducts";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = mockProducts.find((item) => String(item.id) === id);

  if (!product) {
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
        <img className="card-image large" src={product.image} alt={product.title} />
        <div>
          <h1>{product.title}</h1>
          <p className="price">{product.price}</p>
          <ul className="product-meta">
            <li><strong>Type :</strong> {product.type}</li>
            <li><strong>Ville :</strong> {product.city}</li>
            {product.rooms && <li><strong>Pièces :</strong> {product.rooms}</li>}
            <li><strong>Surface :</strong> {product.surface}</li>
          </ul>
          <Link to="/demande"><Button>Faire une demande sur ce bien</Button></Link>
        </div>
      </div>
    </Container>
  );
}
