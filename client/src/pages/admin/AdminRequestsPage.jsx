import { mockRequests } from "../../data/mockProducts";

export default function AdminRequestsPage() {
  return (
    <>
      <h1>Demandes clients</h1>
      <p className="muted">Demandes formulées via la section « Demande » du site (données de démonstration).</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Sujet</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.client}</td>
              <td>{request.subject}</td>
              <td>
                <span className={`badge badge-${request.status === "traité" ? "done" : "pending"}`}>
                  {request.status}
                </span>
              </td>
              <td className="admin-actions">
                <button className="link-btn">Contacter</button>
                <button className="link-btn">Marquer traité</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
