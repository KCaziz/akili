import { useState } from "react";
import { uploadFile, resolveMediaUrl } from "../../lib/api";

function move(list, from, to) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function MultiImageField({ images, onChange }) {
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState(null);

  async function handleFiles(event) {
    const files = [...(event.target.files || [])];
    event.target.value = "";
    if (!files.length) return;
    setError(null);
    setUploading(files.length);
    const uploaded = [];
    for (const file of files) {
      try {
        uploaded.push((await uploadFile(file)).url);
      } catch (err) {
        setError(`${file.name} : ${err.message}`);
      }
      setUploading((count) => count - 1);
    }
    onChange([...images, ...uploaded]);
  }

  return (
    <div className="multi-image-field">
      <span className="field-label">Photos ({images.length}) — la première est la photo principale</span>
      {images.length > 0 && (
        <ol className="multi-image-list">
          {images.map((url, index) => (
            <li key={url + index} className={index === 0 ? "is-cover" : ""}>
              <img src={resolveMediaUrl(url)} alt={`Photo ${index + 1}`} />
              {index === 0 && <span className="multi-image-cover">Principale</span>}
              <div className="multi-image-actions">
                <button type="button" onClick={() => onChange(move(images, index, index - 1))} disabled={index === 0} aria-label="Déplacer avant">
                  ←
                </button>
                {index > 0 && (
                  <button type="button" onClick={() => onChange(move(images, index, 0))} title="Mettre en photo principale">
                    ★
                  </button>
                )}
                <button type="button" onClick={() => onChange(move(images, index, index + 1))} disabled={index === images.length - 1} aria-label="Déplacer après">
                  →
                </button>
                <button type="button" className="danger" onClick={() => onChange(images.filter((_, i) => i !== index))} aria-label="Retirer">
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
      <label className="multi-image-add">
        <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={uploading > 0} />
      </label>
      {uploading > 0 && <span className="muted">Envoi en cours… ({uploading} restante{uploading > 1 ? "s" : ""})</span>}
      {error && <span className="error">{error}</span>}
    </div>
  );
}
