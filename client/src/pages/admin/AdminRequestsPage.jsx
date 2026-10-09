import { useEffect, useState } from "react";
import { fetchRequests, updateRequestStatus } from "../../lib/api";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  function load() {
    setStatus("loading");
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

  return (
    <>
      <h1>Demandes clients</h1>
      <p className="muted">Demandes formulées via les formulaires « Demande » et « Contact » du site.</p>

      {error && <p className="error">{error}</p>}
      {status === "loading" && <p className="muted">Chargement…</p>}
      {status === "ready" && requests.length === 0 && <p className="muted">Aucune demande pour le moment.</p>}

      {status === "ready" && requests.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Détail</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.name}</td>
                <td>{request.contact}</td>
                <td>{request.type === "PRODUIT" ? "Produit" : "Service"}</td>
                <td>{request.details}</td>
                <td>
                  <span className={`badge badge-${request.status === "TRAITE" ? "done" : "pending"}`}>
                    {request.status === "TRAITE" ? "traité" : "en attente"}
                  </span>
                </td>
                <td className="admin-actions">
                  <a className="link-btn" href={`mailto:${request.contact}`}>Contacter</a>
                  <button className="link-btn" onClick={() => toggleStatus(request)}>
                    {request.status === "TRAITE" ? "Marquer en attente" : "Marquer traité"}
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
