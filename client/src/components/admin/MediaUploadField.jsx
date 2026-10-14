import { useState } from "react";
import { uploadFile, resolveMediaUrl } from "../../lib/api";

export default function MediaUploadField({ label, value, onChange, accept = "image/*", previewAsVideo = false }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadFile(file);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <label>
      {label}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input type="file" accept={accept} onChange={handleFileChange} disabled={uploading} />
        {uploading && <span className="muted">Envoi en cours…</span>}
        {error && <span className="error">{error}</span>}
        {value && !uploading && (
          previewAsVideo ? (
            <video src={resolveMediaUrl(value)} controls style={{ maxHeight: 140 }} />
          ) : (
            <img src={resolveMediaUrl(value)} alt="Aperçu" style={{ maxHeight: 140, borderRadius: 8 }} />
          )
        )}
      </div>
    </label>
  );
}
