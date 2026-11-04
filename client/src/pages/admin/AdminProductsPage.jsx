import { lazy, Suspense, useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import MultiImageField from "../../components/admin/MultiImageField";
import { fetchProducts, createProduct, updateProduct, deleteProduct, uploadFile, resolveMediaUrl } from "../../lib/api";
import { productImages } from "../../lib/format";

const LocationPicker = lazy(() => import("../../components/maps/LocationPicker"));

const STATUS_LABELS = { DISPONIBLE: "Disponible", VENDU: "Vendu", LOUE: "Loué" };

const emptyForm = {
  title: "",
  description: "",
  type: "VENTE",
  city: "",
  priceValue: "",
  surface: "",
  rooms: "",
  images: [],
  status: "DISPONIBLE",
  isExclusive: false,
  isFeatured: false,
  latitude: "",
  longitude: "",
  videoUrl: "",
};

function toForm(product) {
  return {
    title: product.title,
    description: product.description || "",
    type: product.type,
    city: product.city,
    priceValue: product.priceValue ?? "",
    surface: product.surface || "",
    rooms: product.rooms ?? "",
    images: productImages(product),
    status: product.status,
    isExclusive: product.isExclusive,
    isFeatured: product.isFeatured,
    latitude: product.latitude ?? "",
    longitude: product.longitude ?? "",
    videoUrl: product.videoUrl || "",
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  function load() {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }

  useEffect(load, []);

  function openForm(product) {
    setForm(product ? toForm(product) : emptyForm);
    setEditingId(product?.id ?? null);
    setError(null);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleVideoFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setVideoUploading(true);
    try {
      const { url } = await uploadFile(file);
      setForm((prev) => ({ ...prev, videoUrl: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setVideoUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (editingId) await updateProduct(editingId, form);
      else await createProduct(form);
      setFormOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await deleteProduct(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="admin-header-row">
        <h1>Produits</h1>
        <Button onClick={() => openForm(null)}>+ Ajouter un produit</Button>
      </div>
      <p className="muted">Gestion du catalogue de biens.</p>

      {error && <p className="error">{error}</p>}

      {formOpen && (
        <form className="form form-wide admin-product-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Modifier le bien" : "Nouveau bien"}</h2>

          <div className="form-row">
            <label>Titre<input name="title" value={form.title} onChange={handleChange} required /></label>
            <label>Type
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="VENTE">Vente</option>
                <option value="LOCATION">Location</option>
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>Ville<input name="city" value={form.city} onChange={handleChange} required /></label>
            <label>
              Prix en DZD {form.type === "LOCATION" && "(par mois)"}
              <input type="number" min="1" step="1" inputMode="numeric" name="priceValue" value={form.priceValue} onChange={handleChange} required />
            </label>
          </div>
          <div className="form-row">
            <label>Surface<input name="surface" value={form.surface} onChange={handleChange} placeholder="ex : 120 m²" /></label>
            <label>Pièces<input type="number" min="0" name="rooms" value={form.rooms} onChange={handleChange} /></label>
          </div>
          <label>Description<textarea name="description" rows={4} value={form.description} onChange={handleChange} /></label>

          <fieldset className="admin-fieldset">
            <legend>Statut et mise en avant</legend>
            <div className="form-row">
              <label>Statut
                <select name="status" value={form.status} onChange={handleChange}>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <div className="checkbox-group">
                <label className="checkbox"><input type="checkbox" name="isExclusive" checked={form.isExclusive} onChange={handleChange} /> Exclusivité</label>
                <label className="checkbox"><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} /> En vedette sur l'accueil</label>
              </div>
            </div>
            <p className="muted">Le badge « Nouveau » s'affiche automatiquement pendant 30 jours après la publication.</p>
          </fieldset>

          <fieldset className="admin-fieldset">
            <legend>Photos</legend>
            <MultiImageField images={form.images} onChange={(images) => setForm((prev) => ({ ...prev, images }))} />
          </fieldset>

          <fieldset className="admin-fieldset">
            <legend>Vidéo de visite (facultatif)</legend>
            <label>
              Lien YouTube / Vimeo, ou fichier vidéo
              <input name="videoUrl" value={form.videoUrl} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=…" />
            </label>
            <input type="file" accept="video/mp4,video/webm" onChange={handleVideoFile} disabled={videoUploading} />
            {videoUploading && <span className="muted">Envoi de la vidéo…</span>}
            {form.videoUrl && !form.videoUrl.startsWith("http") && (
              <video src={resolveMediaUrl(form.videoUrl)} controls style={{ maxHeight: 160 }} />
            )}
          </fieldset>

          <fieldset className="admin-fieldset">
            <legend>Emplacement sur la carte (facultatif)</legend>
            <p className="muted">Cliquez sur la carte pour placer le bien.</p>
            <Suspense fallback={<p className="muted">Chargement de la carte…</p>}>
              <LocationPicker
                latitude={form.latitude}
                longitude={form.longitude}
                onPick={(latitude, longitude) => setForm((prev) => ({ ...prev, latitude, longitude }))}
              />
            </Suspense>
            <div className="form-row">
              <label>Latitude<input type="number" step="any" name="latitude" value={form.latitude} onChange={handleChange} /></label>
              <label>Longitude<input type="number" step="any" name="longitude" value={form.longitude} onChange={handleChange} /></label>
            </div>
            {form.latitude !== "" && (
              <button type="button" className="link-btn danger" onClick={() => setForm((prev) => ({ ...prev, latitude: "", longitude: "" }))}>
                Retirer la position
              </button>
            )}
          </fieldset>

          <div style={{ display: "flex", gap: 12 }}>
            <Button type="submit">{saving ? "Enregistrement…" : editingId ? "Enregistrer" : "Créer"}</Button>
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Annuler</Button>
          </div>
        </form>
      )}

      {status === "loading" && <p className="muted">Chargement…</p>}

      {status === "ready" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Titre</th>
              <th>Type</th>
              <th>Ville</th>
              <th>Prix</th>
              <th>Statut</th>
              <th>Vues</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.image && (
                    <img src={resolveMediaUrl(product.image)} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} />
                  )}
                </td>
                <td>
                  {product.title}
                  <div className="admin-flags">
                    {product.isFeatured && <span className="badge badge-done">Vedette</span>}
                    {product.isExclusive && <span className="badge badge-pending">Exclusivité</span>}
                    <span className="muted">{productImages(product).length} photo(s)</span>
                  </div>
                </td>
                <td>{product.type === "VENTE" ? "Vente" : "Location"}</td>
                <td>{product.city}</td>
                <td>{product.price}</td>
                <td>{STATUS_LABELS[product.status]}</td>
                <td>{product.views}</td>
                <td className="admin-actions">
                  <button className="link-btn" onClick={() => openForm(product)}>Modifier</button>
                  <button className="link-btn danger" onClick={() => handleDelete(product.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
