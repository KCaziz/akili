import { mockOffers } from "../../data/mockProducts";

export default function AdminOffersPage() {
  return (
    <>
      <h1>Offres de vente reçues</h1>
      <p className="muted">Biens proposés via la section « Vendre » du site (données de démonstration).</p>

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
          {mockOffers.map((offer) => (
            <tr key={offer.id}>
              <td>{offer.client}</td>
              <td>{offer.subject}</td>
              <td>
                <span className={`badge badge-${offer.status === "traité" ? "done" : "pending"}`}>
                  {offer.status}
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
