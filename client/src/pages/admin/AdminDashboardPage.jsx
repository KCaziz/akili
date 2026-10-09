import { useEffect, useState } from "react";
import { fetchProducts, fetchServices, fetchRequests, fetchSellOffers } from "../../lib/api";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchServices(), fetchRequests(), fetchSellOffers()])
      .then(([products, services, requests, offers]) => {
        setCounts({
          products: products.length,
          services: services.length,
          requestsPending: requests.filter((r) => r.status === "EN_ATTENTE").length,
          offersPending: offers.filter((o) => o.status === "EN_ATTENTE").length,
        });
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <h1>Tableau de bord</h1>
      <p className="muted">Vue d'ensemble de l'activité.</p>

      {error && <p className="error">{error}</p>}

      {counts && (
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-value">{counts.products}</span>
            <span className="stat-label">Produits en ligne</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{counts.services}</span>
            <span className="stat-label">Services proposés</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{counts.requestsPending}</span>
            <span className="stat-label">Demandes en attente</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{counts.offersPending}</span>
            <span className="stat-label">Offres de vente en attente</span>
          </div>
        </div>
      )}
    </>
  );
}
