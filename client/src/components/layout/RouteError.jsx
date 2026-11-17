import { useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NotFoundPage from "../../pages/NotFoundPage";

const RELOAD_KEY = "akili_chunk_reload";

// Après une mise en ligne, les fichiers de l'ancienne version n'existent plus : un onglet resté
// ouvert échoue en chargeant une page (« Failed to fetch dynamically imported module »).
function isStaleBuildError(error) {
  const message = String(error?.message || error || "");
  return /dynamically imported module|Importing a module script failed|module script|Loading chunk|error loading dynamically/i.test(message);
}

// Écran affiché quand une page plante, à la place de l'écran technique de react-router.
export default function RouteError({ admin = false }) {
  const error = useRouteError();
  // L’admin est en français ; le site public suit la langue du visiteur.
  const { t } = useTranslation(undefined, admin ? { lng: "fr" } : undefined);
  const stale = isStaleBuildError(error);

  useEffect(() => {
    if (!stale) return;
    // Recharge automatiquement pour récupérer la nouvelle version, au plus une fois par minute
    // (évite une boucle si le problème persiste, ex. connexion coupée).
    let recent = false;
    try {
      recent = Date.now() - Number(sessionStorage.getItem(RELOAD_KEY) || 0) < 60_000;
      sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    } catch {
      // stockage indisponible : on recharge quand même
    }
    if (!recent) window.location.reload();
  }, [stale]);

  if (!admin && isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;

  if (!stale) console.error(error);

  return (
    <div className={admin ? "route-error route-error-admin" : "route-error"} role="alert">
      <h1>{t(stale ? "errorPage.updateTitle" : "errorPage.title")}</h1>
      <p>{t(stale ? "errorPage.updateText" : "errorPage.text")}</p>
      <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
        {t("errorPage.reload")}
      </button>
    </div>
  );
}
