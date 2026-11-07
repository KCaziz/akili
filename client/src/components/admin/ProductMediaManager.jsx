import { useState } from "react";
import { uploadFile, resolveMediaUrl } from "../../lib/api";
import { videoEmbedUrl } from "../../lib/format";
import AdminIcon from "./AdminIcon";

function move(list, index, offset) {
  const target = index + offset;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function MediaTile({ children, badge, index, count, onMove, onRemove }) {
  return (
    <div className="media-tile">
      {children}
      {badge}
      <div className="media-tile-actions">
        <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label="Déplacer avant">‹</button>
        <button type="button" onClick={() => onMove(index, 1)} disabled={index === count - 1} aria-label="Déplacer après">›</button>
        <button type="button" className="danger" onClick={() => onRemove(index)} aria-label="Retirer">
          <AdminIcon name="trash" size={14} />
        </button>
      </div>
    </div>
  );
}

function VideoPreview({ url }) {
  if (videoEmbedUrl(url)) {
    return (
      <div className="media-tile-link">
        <AdminIcon name="video" size={22} />
        <span>{url.replace(/^https?:\/\/(www\.)?/, "")}</span>
      </div>
    );
  }
  return <video src={resolveMediaUrl(url)} muted preload="metadata" />;
}

export default function ProductMediaManager({ images, videos, onChange }) {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [videoLink, setVideoLink] = useState("");

  async function handleFiles(event, kind) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;
    setError(null);
    const uploaded = [];
    try {
      for (const [index, file] of files.entries()) {
        setProgress(`Envoi ${index + 1}/${files.length}…`);
        const { url } = await uploadFile(file);
        uploaded.push(url);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProgress(null);
      if (uploaded.length > 0) {
        onChange(kind === "images" ? { images: [...images, ...uploaded], videos } : { images, videos: [...videos, ...uploaded] });
      }
    }
  }

  function addVideoLink() {
    const url = videoLink.trim();
    if (!url) return;
    if (!videoEmbedUrl(url)) {
      setError("Lien non reconnu : collez un lien YouTube ou Vimeo (ou envoyez un fichier vidéo).");
      return;
    }
    setError(null);
    setVideoLink("");
    onChange({ images, videos: [...videos, url] });
  }

  const busy = Boolean(progress);

  return (
    <div className="media-manager">
      <div className="media-manager-header">
        <span className="media-manager-label">Photos ({images.length})</span>
        <label className={`admin-btn admin-btn-outline ${busy ? "disabled" : ""}`}>
          <AdminIcon name="image" size={16} /> Ajouter des photos
          <input type="file" accept="image/*" multiple hidden disabled={busy} onChange={(event) => handleFiles(event, "images")} />
        </label>
      </div>

      {images.length === 0 ? (
        <div className="media-manager-empty">Aucune photo pour l'instant. Ajoutez au moins une photo pour la couverture du bien.</div>
      ) : (
        <div className="media-grid">
          {images.map((url, index) => (
            <MediaTile
              key={`${url}-${index}`}
              index={index}
              count={images.length}
              badge={index === 0 && <span className="media-badge media-badge-cover">Couverture</span>}
              onMove={(i, offset) => onChange({ images: move(images, i, offset), videos })}
              onRemove={(i) => onChange({ images: images.filter((_, j) => j !== i), videos })}
            >
              <img src={resolveMediaUrl(url)} alt="" />
            </MediaTile>
          ))}
        </div>
      )}

      <div className="media-manager-header media-manager-header-spaced">
        <span className="media-manager-label">Vidéos ({videos.length})</span>
        <label className={`admin-btn admin-btn-outline ${busy ? "disabled" : ""}`}>
          <AdminIcon name="video" size={16} /> Envoyer des vidéos
          <input type="file" accept="video/mp4,video/webm" multiple hidden disabled={busy} onChange={(event) => handleFiles(event, "videos")} />
        </label>
      </div>

      <div className="media-link-row">
        <input
          type="url"
          value={videoLink}
          onChange={(event) => setVideoLink(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addVideoLink();
            }
          }}
          placeholder="Ou collez un lien YouTube / Vimeo"
        />
        <button type="button" className="admin-btn admin-btn-outline" onClick={addVideoLink} disabled={!videoLink.trim()}>
          <AdminIcon name="plus" size={16} /> Ajouter le lien
        </button>
      </div>

      {videos.length > 0 && (
        <div className="media-grid">
          {videos.map((url, index) => (
            <MediaTile
              key={`${url}-${index}`}
              index={index}
              count={videos.length}
              badge={<span className="media-badge">Vidéo {index + 1}</span>}
              onMove={(i, offset) => onChange({ images, videos: move(videos, i, offset) })}
              onRemove={(i) => onChange({ images, videos: videos.filter((_, j) => j !== i) })}
            >
              <VideoPreview url={url} />
            </MediaTile>
          ))}
        </div>
      )}

      {progress && <p className="muted">{progress}</p>}
      {error && <p className="error">{error}</p>}

      <p className="media-manager-hint">
        La première photo sert de couverture dans le catalogue. Les vidéos ne s'affichent que sur la fiche détaillée du bien.
      </p>
    </div>
  );
}
