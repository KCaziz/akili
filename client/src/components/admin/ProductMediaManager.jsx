import { useState } from "react";
import { uploadFile, resolveMediaUrl } from "../../lib/api";
import AdminIcon from "./AdminIcon";

export default function ProductMediaManager({ media, onChange }) {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const coverIndex = media.findIndex((item) => item.type === "PHOTO");

  async function handleFiles(event, type) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;
    setError(null);
    const uploaded = [];
    try {
      for (const [index, file] of files.entries()) {
        setProgress(`Envoi ${index + 1}/${files.length}…`);
        const { url } = await uploadFile(file);
        uploaded.push({ type, url });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProgress(null);
      if (uploaded.length > 0) onChange([...media, ...uploaded]);
    }
  }

  function move(index, offset) {
    const target = index + offset;
    if (target < 0 || target >= media.length) return;
    const next = [...media];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function remove(index) {
    onChange(media.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="media-manager">
      <div className="media-manager-header">
        <span className="media-manager-label">Photos et vidéos</span>
        <div className="media-manager-buttons">
          <label className={`admin-btn admin-btn-outline ${progress ? "disabled" : ""}`}>
            <AdminIcon name="image" size={16} /> Ajouter des photos
            <input type="file" accept="image/*" multiple hidden disabled={Boolean(progress)} onChange={(event) => handleFiles(event, "PHOTO")} />
          </label>
          <label className={`admin-btn admin-btn-outline ${progress ? "disabled" : ""}`}>
            <AdminIcon name="video" size={16} /> Ajouter des vidéos
            <input type="file" accept="video/*" multiple hidden disabled={Boolean(progress)} onChange={(event) => handleFiles(event, "VIDEO")} />
          </label>
        </div>
      </div>

      {progress && <p className="muted">{progress}</p>}
      {error && <p className="error">{error}</p>}

      {media.length === 0 ? (
        <div className="media-manager-empty">Aucun média pour l'instant. Ajoutez au moins une photo pour la couverture du bien.</div>
      ) : (
        <div className="media-grid">
          {media.map((item, index) => (
            <div key={`${item.url}-${index}`} className="media-tile">
              {item.type === "PHOTO" ? (
                <img src={resolveMediaUrl(item.url)} alt="" />
              ) : (
                <video src={resolveMediaUrl(item.url)} muted preload="metadata" />
              )}
              {index === coverIndex && <span className="media-badge media-badge-cover">Couverture</span>}
              {item.type === "VIDEO" && <span className="media-badge">Vidéo</span>}
              <div className="media-tile-actions">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Déplacer avant">‹</button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === media.length - 1} aria-label="Déplacer après">›</button>
                <button type="button" className="danger" onClick={() => remove(index)} aria-label="Retirer">
                  <AdminIcon name="trash" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="media-manager-hint">
        La première photo sert de couverture dans le catalogue. Les vidéos ne s'affichent que sur la fiche détaillée du bien.
      </p>
    </div>
  );
}
