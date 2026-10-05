import { mockProducts, mockRequests, mockOffers } from "../../data/mockProducts";

export default function AdminDashboardPage() {
  return (
    <>
      <h1>Tableau de bord</h1>
      <p className="muted">Vue d'ensemble de l'activité (données de démonstration).</p>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-value">{mockProducts.length}</span>
          <span className="stat-label">Produits en ligne</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{mockRequests.length}</span>
          <span className="stat-label">Demandes reçues</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{mockOffers.length}</span>
          <span className="stat-label">Offres de vente reçues</span>
        </div>
      </div>
    </>
  );
}
