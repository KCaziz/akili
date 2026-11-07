import { useEffect, useState } from "react";
import { fetchSellOffers, updateSellOfferStatus } from "../../lib/api";
import { formatDate, formatDateTime } from "../../lib/format";
import TruncatedText from "../../components/admin/TruncatedText";
import StatusFilter from "../../components/admin/StatusFilter";
import { filterByStatus } from "../../lib/status";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  function load() {
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

  const visible = filterByStatus(offers, filter);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Offres de vente reçues</h1>
          <p className="muted">Biens proposés via la page « Vendre » du site.</p>
        </div>
        {status === "ready" && <StatusFilter items={offers} value={filter} onChange={setFilter} />}
      </div>

      {error && <p className="error">{error}</p>}
      {status === "loading" && <div className="skeleton skeleton-table" />}
      {status === "ready" && visible.length === 0 && <div className="admin-empty">Aucune offre à afficher.</div>}

      {status === "ready" && visible.length > 0 && (
        <div className="admin-card admin-table-card">
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Vendeur</th>
                  <th>Contact</th>
                  <th>Bien</th>
                  <th>Description</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((offer) => (
                  <tr key={offer.id}>
                    <td>
                      <strong className="cell-title">{offer.name}</strong>
                      <span className="cell-sub">{formatDate(offer.createdAt)}</span>
                    </td>
                    <td>
                      <span className="cell-line">{offer.phone}</span>
                      {offer.email && <span className="cell-sub">{offer.email}</span>}
                    </td>
                    <td>
                      <strong className="cell-title">{offer.propertyType}</strong>
                      <span className="cell-sub">{offer.city}{offer.price ? ` · ${offer.price}` : ""}</span>
                    </td>
                    <td className="admin-description-cell">
                      <TruncatedText
                        text={offer.description}
                        title={`Offre de ${offer.name}`}
                        fields={[
                          { label: "Reçue le", value: formatDateTime(offer.createdAt) },
                          { label: "NIN", value: offer.nationalId },
                          { label: "Téléphone", value: offer.phone },
                          { label: "E-mail", value: offer.email },
                          { label: "Type de bien", value: offer.propertyType },
                          { label: "Ville", value: offer.city },
                          { label: "Surface", value: offer.surface },
                          { label: "Prix souhaité", value: offer.price },
                        ]}
                      />
                    </td>
                    <td className="admin-status-cell">
                      <span className={`badge badge-${offer.status === "TRAITE" ? "done" : "pending"}`}>
                        {offer.status === "TRAITE" ? "traité" : "en attente"}
                      </span>
                    </td>
                    <td className="admin-actions">
                      <a className="link-btn" href={`tel:${offer.phone}`}>Appeler</a>
                      {offer.email && <a className="link-btn" href={`mailto:${offer.email}`}>E-mail</a>}
                      <button className="link-btn" onClick={() => toggleStatus(offer)}>
                        {offer.status === "TRAITE" ? "Marquer en attente" : "Marquer traité"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
