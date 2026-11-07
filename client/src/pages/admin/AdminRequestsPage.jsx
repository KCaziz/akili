import { useEffect, useState } from "react";
import { fetchRequests, updateRequestStatus } from "../../lib/api";
import { formatDate, formatDateTime } from "../../lib/format";
import TruncatedText from "../../components/admin/TruncatedText";
import StatusFilter from "../../components/admin/StatusFilter";
import { filterByStatus } from "../../lib/status";

function contactHref(contact) {
  return contact.includes("@") ? `mailto:${contact}` : `tel:${contact}`;
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  function load() {
    fetchRequests()
      .then((data) => {
        setRequests(data);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }

  useEffect(load, []);

  async function toggleStatus(request) {
    const newStatus = request.status === "TRAITE" ? "EN_ATTENTE" : "TRAITE";
    try {
      await updateRequestStatus(request.id, newStatus);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const visible = filterByStatus(requests, filter);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Demandes clients</h1>
          <p className="muted">Demandes envoyées via les formulaires « Demande » et « Contact » du site.</p>
        </div>
        {status === "ready" && <StatusFilter items={requests} value={filter} onChange={setFilter} />}
      </div>

      {error && <p className="error">{error}</p>}
      {status === "loading" && <div className="skeleton skeleton-table" />}
      {status === "ready" && visible.length === 0 && <div className="admin-empty">Aucune demande à afficher.</div>}

      {status === "ready" && visible.length > 0 && (
        <div className="admin-card admin-table-card">
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Type</th>
                  <th>Détail</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <strong className="cell-title">{request.name}</strong>
                      <span className="cell-sub">{formatDate(request.createdAt)}</span>
                    </td>
                    <td>{request.contact}</td>
                    <td>
                      <span className={`type-pill type-${request.type === "PRODUIT" ? "product" : "service"}`}>
                        {request.type === "PRODUIT" ? "Produit" : "Service"}
                      </span>
                    </td>
                    <td className="admin-description-cell">
                      <TruncatedText
                        text={request.details}
                        title={`Demande de ${request.name}`}
                        fields={[
                          { label: "Reçue le", value: formatDateTime(request.createdAt) },
                          { label: "NIN", value: request.nationalId },
                          { label: "Contact", value: request.contact },
                          { label: "Type", value: request.type === "PRODUIT" ? "Produit" : "Service" },
                        ]}
                      />
                    </td>
                    <td className="admin-status-cell">
                      <span className={`badge badge-${request.status === "TRAITE" ? "done" : "pending"}`}>
                        {request.status === "TRAITE" ? "traité" : "en attente"}
                      </span>
                    </td>
                    <td className="admin-actions">
                      <a className="link-btn" href={contactHref(request.contact)}>Contacter</a>
                      <button className="link-btn" onClick={() => toggleStatus(request)}>
                        {request.status === "TRAITE" ? "Marquer en attente" : "Marquer traité"}
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
