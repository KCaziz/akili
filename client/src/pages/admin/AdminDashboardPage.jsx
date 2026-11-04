import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStats, fetchSettings } from "../../lib/api";

// Palette validée (contraste ≥ 3:1 sur fond clair, séparation daltonisme ΔE ≥ 17).
const SERIES = [
  { key: "requests", label: "Demandes et messages", color: "#007a99" },
  { key: "offers", label: "Offres de vente", color: "#b9770e" },
];

function monthLabel(key, withYear = false) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("fr-FR", withYear ? { month: "long", year: "numeric" } : { month: "short" });
}

function MonthlyChart({ monthly }) {
  const [hovered, setHovered] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const max = Math.max(1, ...monthly.flatMap((month) => SERIES.map((series) => month[series.key])));
  const total = monthly.reduce((sum, month) => sum + month.requests + month.offers, 0);

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-head">
        <h2>Demandes reçues par mois</h2>
        <button type="button" className="link-btn" onClick={() => setShowTable((value) => !value)}>
          {showTable ? "Voir le graphique" : "Voir en tableau"}
        </button>
      </div>
      <ul className="chart-legend">
        {SERIES.map((series) => (
          <li key={series.key}>
            <span className="chart-swatch" style={{ background: series.color }} /> {series.label}
          </li>
        ))}
      </ul>

      {total === 0 && <p className="muted">Aucune demande sur les 12 derniers mois.</p>}

      {showTable ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mois</th>
              {SERIES.map((series) => <th key={series.key}>{series.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {monthly.map((month) => (
              <tr key={month.month}>
                <td>{monthLabel(month.month, true)}</td>
                {SERIES.map((series) => <td key={series.key}>{month[series.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="bar-chart" role="img" aria-label="Demandes et offres reçues par mois sur 12 mois (version tableau disponible)">
          <div className="bar-chart-plot">
            {monthly.map((month) => (
              <div
                key={month.month}
                className={`bar-chart-group ${hovered === month.month ? "is-hovered" : ""}`}
                onMouseEnter={() => setHovered(month.month)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="bar-chart-bars">
                  {SERIES.map((series) => (
                    <span
                      key={series.key}
                      className="bar-chart-bar"
                      style={{ height: `${(month[series.key] / max) * 100}%`, background: series.color }}
                    />
                  ))}
                </div>
                <span className="bar-chart-label">{monthLabel(month.month)}</span>
                {hovered === month.month && (
                  <div className="chart-tooltip" role="tooltip">
                    <strong>{monthLabel(month.month, true)}</strong>
                    {SERIES.map((series) => (
                      <span key={series.key}>
                        <span className="chart-swatch" style={{ background: series.color }} /> {series.label} : {month[series.key]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <span className="bar-chart-max">max {max}</span>
        </div>
      )}
    </section>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [figuresMissing, setFiguresMissing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch((err) => setError(err.message));
    fetchSettings()
      .then((settings) => setFiguresMissing(!settings.yearsExperience && !settings.propertiesSold && !settings.clientsServed))
      .catch(() => {});
  }, []);

  return (
    <>
      <h1>Tableau de bord</h1>
      <p className="muted">Vue d'ensemble de l'activité.</p>

      {error && <p className="error">{error}</p>}
      {figuresMissing && (
        <p className="notice">
          Les chiffres clés de la page d'accueil ne sont pas encore renseignés — <Link to="/admin/parametres">les compléter</Link>.
        </p>
      )}

      {stats && (
        <>
          <div className="stat-grid">
            <Link to="/admin/produits" className="stat-card">
              <span className="stat-value">{stats.totals.products}</span>
              <span className="stat-label">Biens au catalogue</span>
            </Link>
            <Link to="/admin/demandes" className="stat-card">
              <span className="stat-value">{stats.totals.requestsPending}</span>
              <span className="stat-label">Demandes en attente</span>
            </Link>
            <Link to="/admin/offres" className="stat-card">
              <span className="stat-value">{stats.totals.offersPending}</span>
              <span className="stat-label">Offres de vente en attente</span>
            </Link>
            <Link to="/admin/alertes" className="stat-card">
              <span className="stat-value">{stats.totals.activeAlerts}</span>
              <span className="stat-label">Alertes visiteurs actives</span>
            </Link>
          </div>

          <MonthlyChart monthly={stats.monthly} />

          <section className="dashboard-panel">
            <h2>Biens les plus consultés</h2>
            {stats.topViewed.every((product) => product.views === 0) ? (
              <p className="muted">Pas encore de consultations enregistrées.</p>
            ) : (
              <ol className="top-viewed">
                {stats.topViewed.map((product) => (
                  <li key={product.id}>
                    <Link to={`/produits/${product.id}`} target="_blank">{product.title}</Link>
                    <span className="muted"> · {product.city}</span>
                    <strong>{product.views} vue{product.views > 1 ? "s" : ""}</strong>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </>
      )}
    </>
  );
}
