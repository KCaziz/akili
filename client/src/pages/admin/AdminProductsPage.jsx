import { useState } from "react";
import Button from "../../components/ui/Button";
import { mockProducts } from "../../data/mockProducts";

export default function AdminProductsPage() {
  const [products] = useState(mockProducts);

  return (
    <>
      <div className="admin-header-row">
        <h1>Produits &amp; services</h1>
        <Button>+ Ajouter un produit</Button>
      </div>
      <p className="muted">
        Gestion du catalogue (données de démonstration — ajout/suppression réels en Phase 3).
      </p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Type</th>
            <th>Ville</th>
            <th>Prix</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.type}</td>
              <td>{product.city}</td>
              <td>{product.price}</td>
              <td className="admin-actions">
                <button className="link-btn">Modifier</button>
                <button className="link-btn danger">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
