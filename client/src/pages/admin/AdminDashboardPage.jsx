import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, fetchServices, fetchRequests, fetchSellOffers, fetchGallery, resolveMediaUrl } from "../../lib/api";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import AdminIcon from "../../components/admin/AdminIcon";

const MONTHS_SHOWN = 6;
const monthFormatter = new Intl.DateTimeFormat("fr-FR", { month: "short" });
const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

function StatCard({ icon, label, value, hint, to, tone }) {
  const animated = useCountUp(value);
  return (
    <Link to={to} className={`stat-card stat-${tone}`}>
      <span className="stat-icon"><AdminIcon name={icon} size={22} /></span>
      <span className="stat-value">{animated}</span>
      <span className="stat-label">{label}</span>
      {hint && <span className="stat-hint">{hint}</span>}
    </Link>
  );
}

function buildMonthlyActivity(requests, offers) {
  const now = new Date();
  const months = Array.from({ length: MONTHS_SHOWN }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (MONTHS_SHOWN - 1 - index), 1);
    return { key: `${date.getFullYear()}-${date.getMonth()}`, label: monthFormatter.format(date), requests: 0, offers: 0 };
  });
  const byKey = new Map(months.map((month) => [month.key, month]));
  for (const [items, field] of [[requests, "requests"], [offers, "offers"]]) {
    for (const item of items) {
      const date = new Date(item.createdAt);
      const month = byKey.get(`${date.getFullYear()}-${date.getMonth()}`);
      if (month) month[field] += 1;
    }
  }
  return months;
}

function greeting() {
  const hour = new Date().getHours();
  return hour < 18 ? "Bonjour" : "Bonsoir";
}

export default function AdminDashboardPage() {
  const { admin } = useAdminAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchServices(), fetchRequests(), fetchSellOffers(), fetchGallery()])
      .then(([products, services, requests, offers, gallery]) => setData({ products, services, requests, offers, gallery }))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error">{error}</p>;

  if (!data) {
    return (
      <div className="dashboard-skeleton">
        <div className="skeleton skeleton-banner" />
        <div className="stat-grid">
          {[0, 1, 2, 3].map((index) => <div key={index} className="skeleton skeleton-card" />)}
        </div>
      </div>
    );
  }

  const { products, services, requests, offers, gallery } = data;
  const pendingRequests = requests.filter((request) => request.status === "EN_ATTENTE");
  const pendingOffers = offers.filter((offer) => offer.status === "EN_ATTENTE");
  const forSale = products.filter((product) => product.type === "VENTE").length;
  const salePercent = products.length ? Math.round((forSale / products.length) * 100) : 0;
  const activity = buildMonthlyActivity(requests, offers);
  const maxActivity = Math.max(1, ...activity.map((month) => Math.max(month.requests, month.offers)));
  const totalPending = pendingRequests.length + pendingOffers.length;

  return (
    <div className="dashboard">
      <section className="dashboard-banner">
        <div>
          <p className="dashboard-banner-eyebrow">{greeting()}, {admin?.username}</p>
          <h1>Voici l'activité de votre agence</h1>
          <p className="dashboard-banner-text">
            {totalPending > 0
              ? `${totalPending} élément${totalPending > 1 ? "s" : ""} en attente de traitement.`
              : "Tout est à jour, aucune demande en attente."}
          </p>
        </div>
        <div className="dashboard-banner-actions">
          <Link to="/admin/produits" className="admin-btn admin-btn-light">
            <AdminIcon name="plus" size={16} /> Ajouter un bien
          </Link>
          <Link to="/admin/demandes" className="admin-btn admin-btn-ghost">
            Voir les demandes <AdminIcon name="arrowRight" size={16} />
          </Link>
        </div>
      </section>

      <div className="stat-grid">
        <StatCard icon="building" tone="teal" label="Biens en ligne" value={products.length} hint={`${forSale} en vente · ${products.length - forSale} en location`} to="/admin/produits" />
        <StatCard icon="inbox" tone="amber" label="Demandes en attente" value={pendingRequests.length} hint={`${requests.length} au total`} to="/admin/demandes" />
        <StatCard icon="tag" tone="rose" label="Offres de vente en attente" value={pendingOffers.length} hint={`${offers.length} au total`} to="/admin/offres" />
        <StatCard icon="image" tone="indigo" label="Médias en galerie" value={gallery.length} hint={`${services.length} services proposés`} to="/admin/galerie" />
      </div>

      <div className="dashboard-grid">
        <section className="admin-card dashboard-chart">
          <header className="admin-card-header">
            <h2>Activité des 6 derniers mois</h2>
            <div className="chart-legend">
              <span className="legend-dot legend-requests" /> Demandes
              <span className="legend-dot legend-offers" /> Offres de vente
            </div>
          </header>
          <div className="chart-bars">
            {activity.map((month) => (
              <div key={month.key} className="chart-col">
                <div className="chart-col-bars">
                  <span
                    className="chart-bar chart-bar-requests"
                    style={{ height: `${(month.requests / maxActivity) * 100}%` }}
                    title={`${month.requests} demande(s)`}
                  >
                    {month.requests > 0 && <em>{month.requests}</em>}
                  </span>
                  <span
                    className="chart-bar chart-bar-offers"
                    style={{ height: `${(month.offers / maxActivity) * 100}%` }}
                    title={`${month.offers} offre(s)`}
                  >
                    {month.offers > 0 && <em>{month.offers}</em>}
                  </span>
                </div>
                <span className="chart-label">{month.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <header className="admin-card-header">
            <h2>Catalogue</h2>
          </header>
          <div className="split-bar">
            <span className="split-bar-sale" style={{ width: `${salePercent}%` }} />
          </div>
          <div className="split-legend">
            <span><span className="legend-dot legend-requests" /> Vente <strong>{forSale}</strong></span>
            <span><span className="legend-dot legend-offers" /> Location <strong>{products.length - forSale}</strong></span>
          </div>
          <ul className="mini-list">
            {products.slice(0, 4).map((product) => (
              <li key={product.id}>
                <span className="mini-thumb" style={{ backgroundImage: product.image ? `url("${resolveMediaUrl(product.image)}")` : undefined }} />
                <div>
                  <strong>{product.title}</strong>
                  <span>{product.city} · {product.price}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-card">
          <header className="admin-card-header">
            <h2>Dernières demandes</h2>
            <Link to="/admin/demandes" className="admin-card-link">Tout voir</Link>
          </header>
          {requests.length === 0 ? (
            <p className="muted">Aucune demande pour le moment.</p>
          ) : (
            <ul className="activity-list">
              {requests.slice(0, 5).map((request) => (
                <li key={request.id}>
                  <span className="activity-avatar">{request.name.charAt(0).toUpperCase()}</span>
                  <div className="activity-body">
                    <strong>{request.name}</strong>
                    <span>{request.details}</span>
                  </div>
                  <div className="activity-meta">
                    <span className={`badge badge-${request.status === "TRAITE" ? "done" : "pending"}`}>
                      {request.status === "TRAITE" ? "traité" : "en attente"}
                    </span>
                    <time>{dateFormatter.format(new Date(request.createdAt))}</time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card">
          <header className="admin-card-header">
            <h2>Dernières offres de vente</h2>
            <Link to="/admin/offres" className="admin-card-link">Tout voir</Link>
          </header>
          {offers.length === 0 ? (
            <p className="muted">Aucune offre pour le moment.</p>
          ) : (
            <ul className="activity-list">
              {offers.slice(0, 5).map((offer) => (
                <li key={offer.id}>
                  <span className="activity-avatar activity-avatar-alt">{offer.name.charAt(0).toUpperCase()}</span>
                  <div className="activity-body">
                    <strong>{offer.name}</strong>
                    <span>{offer.propertyType} · {offer.city}</span>
                  </div>
                  <div className="activity-meta">
                    <span className={`badge badge-${offer.status === "TRAITE" ? "done" : "pending"}`}>
                      {offer.status === "TRAITE" ? "traité" : "en attente"}
                    </span>
                    <time>{dateFormatter.format(new Date(offer.createdAt))}</time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
