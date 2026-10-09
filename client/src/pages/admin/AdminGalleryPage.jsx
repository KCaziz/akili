import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import MediaUploadField from "../../components/admin/MediaUploadField";
import { fetchGallery, createGalleryMedia, deleteGalleryMedia, resolveMediaUrl } from "../../lib/api";

const emptyForm = { type: "PHOTO", url: "", caption: "" };

export default function AdminGalleryPage() {
  const [media, setMedia] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function load() {
    setStatus("loading");
    fetchGallery()
      .then((data) => {
        setMedia(data);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }

  useEffect(load, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    try {
      await createGalleryMedia(form);
      setForm(emptyForm);
      setFormOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer ce média ?")) return;
    try {
      await deleteGalleryMedia(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="admin-header-row">
        <h1>Galerie</h1>
        <Button onClick={() => setFormOpen((open) => !open)}>+ Ajouter un média</Button>
      </div>
      <p className="muted">Gestion des photos et vidéos de l'agence.</p>

      {error && <p className="error">{error}</p>}

      {formOpen && (
        <form className="form form-wide" onSubmit={handleSubmit} style={{ margin: "20px 0" }}>
          <div className="form-row">
            <label>Type
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="PHOTO">Photo</option>
                <option value="VIDEO">Vidéo</option>
              </select>
            </label>
            <label>Légende<input name="caption" value={form.caption} onChange={handleChange} /></label>
          </div>
          <MediaUploadField
            label="Fichier"
            value={form.url}
            onChange={(url) => setForm((prev) => ({ ...prev, url }))}
            accept={form.type === "VIDEO" ? "video/*" : "image/*"}
            previewAsVideo={form.type === "VIDEO"}
          />
          <Button type="submit">Ajouter</Button>
        </form>
      )}

      {status === "ready" && (
        <div className="gallery-grid" style={{ marginTop: 24 }}>
          {media.map((item) => (
            <figure key={item.id} className="gallery-item">
              {item.type === "PHOTO" ? (
                <img src={resolveMediaUrl(item.url)} alt={item.caption || ""} />
              ) : (
                <video src={resolveMediaUrl(item.url)} controls />
              )}
              <figcaption style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{item.caption || "(sans légende)"}</span>
                <button className="link-btn danger" onClick={() => handleDelete(item.id)}>Supprimer</button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </>
  );
}
