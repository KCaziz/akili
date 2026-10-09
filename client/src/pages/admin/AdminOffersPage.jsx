import { useEffect, useState } from "react";
import { fetchSellOffers, updateSellOfferStatus } from "../../lib/api";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  function load() {
    setStatus("loading");
    fetchSellOffers()
      .then((data) => {
        setOffers(data);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }

  useEffect(load, []);

  async function toggleStatus(offer) {
    const newStatus = offer.status === "TRAITE" ? "EN_ATTENTE" : "TRAITE";
    try {
      await updateSellOfferStatus(offer.id, newStatus);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1>Offres de vente reçues</h1>
      <p className="muted">Biens proposés via la section « Vendre » du site.</p>

      {error && <p className="error">{error}</p>}
      {status === "loading" && <p className="muted">Chargement…</p>}
      {status === "ready" && offers.length === 0 && <p className="muted">Aucune offre pour le moment.</p>}

      {status === "ready" && offers.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Bien</th>
              <th>Ville</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id}>
                <td>{offer.name}</td>
                <td>{offer.phone}</td>
                <td>{offer.propertyType}{offer.price ? ` — ${offer.price}` : ""}</td>
                <td>{offer.city}</td>
                <td>
                  <span className={`badge badge-${offer.status === "TRAITE" ? "done" : "pending"}`}>
                    {offer.status === "TRAITE" ? "traité" : "en attente"}
                  </span>
                </td>
                <td className="admin-actions">
                  <a className="link-btn" href={`tel:${offer.phone}`}>Contacter</a>
                  <button className="link-btn" onClick={() => toggleStatus(offer)}>
                    {offer.status === "TRAITE" ? "Marquer en attente" : "Marquer traité"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
