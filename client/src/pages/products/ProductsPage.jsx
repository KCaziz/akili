import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import { mockProducts } from "../../data/mockProducts";

export default function ProductsPage() {
  return (
    <Container className="section">
      <h1>Nos produits</h1>
      <p className="lead">Catalogue des biens proposés par l'agence (données de démonstration).</p>

      <div className="card-grid">
        {mockProducts.map((product) => (
          <Link key={product.id} to={`/produits/${product.id}`} className="card-link">
            <Card>
              <img className="card-image" src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p className="muted">{product.city} · {product.type}</p>
              <p className="price">{product.price}</p>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
