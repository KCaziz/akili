import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAlerts, updateAlert, deleteAlert } from "../../lib/api";
import { formatAmount } from "../../lib/format";

function criteriaLabel(alert) {
  const parts = [
    alert.type === "VENTE" ? "Vente" : alert.type === "LOCATION" ? "Location" : null,
    alert.city,
    alert.maxBudget && `≤ ${formatAmount(alert.maxBudget)} DZD`,
    alert.minRooms && `${alert.minRooms}+ pièces`,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Tous les biens";
}

// Lien de contact pré-rempli avec les biens correspondants (aucun envoi automatique :
// pas de fournisseur e-mail/SMS configuré, l'agence envoie elle-même).
function contactLink(alert) {
  const links = alert.matches.map((match) => `- ${match.title} (${match.price}) : ${window.location.origin}/produits/${match.id}`);
  const body = `Bonjour ${alert.name},\n\nDe nouveaux biens correspondent à votre recherche sur Akili :\n${links.join("\n")}\n\nN'hésitez pas à nous contacter pour une visite.`;
  if (alert.contact.includes("@")) {
    return `mailto:${alert.contact}?subject=${encodeURIComponent("Nouveaux biens correspondant à votre recherche")}&body=${encodeURIComponent(body)}`;
  }
  return `https://wa.me/213${alert.contact.replace(/^0/, "")}?text=${encodeURIComponent(body)}`;
}

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  function load() {
    fetchAlerts()
      .then((data) => {
        setAlerts(data);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }

  useEffect(load, []);

  async function toggle(alert) {
    try {
      await updateAlert(alert.id, !alert.isActive);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Supprimer cette alerte ?")) return;
    try {
      await deleteAlert(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1>Alertes visiteurs</h1>
      <p className="muted">
        Visiteurs ayant demandé à être prévenus d'un nouveau bien correspondant à leur recherche. Pour chaque alerte active, les biens
        disponibles publiés depuis son enregistrement sont listés : le bouton « Prévenir » ouvre WhatsApp ou votre messagerie avec un
        message déjà rédigé. (L'envoi automatique nécessiterait un fournisseur e-mail/SMS, non configuré.)
      </p>

      {error && <p className="error">{error}</p>}
      {status === "loading" && <p className="muted">Chargement…</p>}
      {status === "ready" && alerts.length === 0 && <p className="muted">Aucune alerte pour le moment.</p>}

      {status === "ready" && alerts.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Visiteur</th>
              <th>Critères</th>
              <th>Biens correspondants</th>
              <th className="admin-status-cell">Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td>
                  {alert.name}
                  <div className="muted">{alert.contact}</div>
                  <div className="muted">{new Date(alert.createdAt).toLocaleDateString("fr-FR")}</div>
                </td>
                <td>{criteriaLabel(alert)}</td>
                <td>
                  {alert.matches.length === 0 ? (
                    <span className="muted">Aucun pour l'instant</span>
                  ) : (
                    <ul className="admin-match-list">
                      {alert.matches.map((match) => (
                        <li key={match.id}>
                          <Link to={`/produits/${match.id}`} target="_blank">{match.title}</Link> — {match.price}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="admin-status-cell">
                  <span className={`badge badge-${alert.isActive ? "done" : "pending"}`}>{alert.isActive ? "active" : "désactivée"}</span>
                </td>
                <td className="admin-actions">
                  {alert.matches.length > 0 && (
                    <a className="link-btn" href={contactLink(alert)} target="_blank" rel="noreferrer">Prévenir</a>
                  )}
                  <button className="link-btn" onClick={() => toggle(alert)}>{alert.isActive ? "Désactiver" : "Réactiver"}</button>
                  <button className="link-btn danger" onClick={() => remove(alert.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
