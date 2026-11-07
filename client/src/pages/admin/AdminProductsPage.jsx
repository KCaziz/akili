import { lazy, Suspense, useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import ProductMediaManager from "../../components/admin/ProductMediaManager";
import AdminIcon from "../../components/admin/AdminIcon";
import { fetchProducts, createProduct, updateProduct, deleteProduct, resolveMediaUrl } from "../../lib/api";
import { productImages } from "../../lib/format";

const LocationPicker = lazy(() => import("../../components/maps/LocationPicker"));

const STATUS_LABELS = { DISPONIBLE: "Disponible", VENDU: "Vendu", LOUE: "Loué" };
const STATUS_BADGES = { DISPONIBLE: "badge-done", VENDU: "badge-muted", LOUE: "badge-muted" };

const emptyForm = {
  title: "",
  description: "",
  type: "VENTE",
  city: "",
  priceValue: "",
  surface: "",
  rooms: "",
  images: [],
  videos: [],
  status: "DISPONIBLE",
  isExclusive: false,
  isFeatured: false,
  latitude: "",
  longitude: "",
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
    videos: (product.videos || []).map((video) => video.url),
    status: product.status,
    isExclusive: product.isExclusive,
    isFeatured: product.isFeatured,
    latitude: product.latitude ?? "",
    longitude: product.longitude ?? "",
  };
}

function plural(count, word) {
  return `${count} ${word}${count > 1 ? "s" : ""}`;
}

function mediaSummary(product) {
  const parts = [plural(productImages(product).length, "photo")];
  const videos = product.videos?.length || 0;
  if (videos > 0) parts.push(plural(videos, "vidéo"));
  return parts.join(" · ");
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

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
      <div className="admin-page-header">
        <div>
          <h1>Produits</h1>
          <p className="muted">Gestion du catalogue de biens.</p>
        </div>
        {!formOpen && (
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => openForm(null)}>
            <AdminIcon name="plus" size={16} /> Ajouter un produit
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {formOpen && (
        <form className="admin-card form form-wide admin-form admin-product-form" onSubmit={handleSubmit}>
          <h2 className="admin-form-title">{editingId ? "Modifier le bien" : "Nouveau bien"}</h2>

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
            <legend>Photos et vidéos</legend>
            <ProductMediaManager
              images={form.images}
              videos={form.videos}
              onChange={({ images, videos }) => setForm((prev) => ({ ...prev, images, videos }))}
            />
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

          <div className="admin-form-actions">
            <Button type="submit">{saving ? "Enregistrement…" : editingId ? "Enregistrer" : "Créer"}</Button>
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Annuler</Button>
          </div>
        </form>
      )}

      {status === "loading" && <div className="skeleton skeleton-table" />}
      {status === "ready" && products.length === 0 && <div className="admin-empty">Aucun produit pour le moment.</div>}

      {status === "ready" && products.length > 0 && (
        <div className="admin-card admin-table-card">
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Bien</th>
                  <th>Type</th>
                  <th>Prix</th>
                  <th>Statut</th>
                  <th>Médias</th>
                  <th>Vues</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="cell-with-thumb">
                        {product.image ? (
                          <img className="cell-thumb" src={resolveMediaUrl(product.image)} alt="" />
                        ) : (
                          <span className="cell-thumb cell-thumb-empty" />
                        )}
                        <div>
                          <strong className="cell-title">{product.title}</strong>
                          <span className="cell-sub">{product.city}</span>
                          {(product.isFeatured || product.isExclusive) && (
                            <span className="admin-flags">
                              {product.isFeatured && <span className="flag-pill flag-featured">Vedette</span>}
                              {product.isExclusive && <span className="flag-pill flag-exclusive">Exclusivité</span>}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`type-pill type-${product.type === "VENTE" ? "product" : "service"}`}>
                        {product.type === "VENTE" ? "Vente" : "Location"}
                      </span>
                    </td>
                    <td className="admin-status-cell">{product.price}</td>
                    <td className="admin-status-cell">
                      <span className={`badge ${STATUS_BADGES[product.status]}`}>{STATUS_LABELS[product.status]}</span>
                    </td>
                    <td className="admin-status-cell muted">{mediaSummary(product)}</td>
                    <td className="admin-status-cell">{product.views}</td>
                    <td className="admin-actions">
                      <button className="link-btn" onClick={() => openForm(product)}>Modifier</button>
                      <button className="link-btn danger" onClick={() => handleDelete(product.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
