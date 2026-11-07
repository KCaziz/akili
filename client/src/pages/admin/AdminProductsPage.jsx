import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import ProductMediaManager from "../../components/admin/ProductMediaManager";
import AdminIcon from "../../components/admin/AdminIcon";
import { fetchProducts, createProduct, updateProduct, deleteProduct, resolveMediaUrl } from "../../lib/api";

const emptyForm = { title: "", description: "", type: "VENTE", city: "", price: "", surface: "", rooms: "", media: [] };

function mediaOf(product) {
  if (product.media?.length) return product.media.map(({ type, url }) => ({ type, url }));
  return product.image ? [{ type: "PHOTO", url: product.image }] : [];
}

function mediaSummary(product) {
  const media = mediaOf(product);
  const photos = media.filter((item) => item.type === "PHOTO").length;
  const videos = media.length - photos;
  const parts = [`${photos} photo${photos > 1 ? "s" : ""}`];
  if (videos > 0) parts.push(`${videos} vidéo${videos > 1 ? "s" : ""}`);
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

  function openCreateForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  }

  function openEditForm(product) {
    setForm({
      title: product.title,
      description: product.description || "",
      type: product.type,
      city: product.city,
      price: product.price,
      surface: product.surface || "",
      rooms: product.rooms ?? "",
      media: mediaOf(product),
    });
    setEditingId(product.id);
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await createProduct(form);
      }
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
          <button type="button" className="admin-btn admin-btn-primary" onClick={openCreateForm}>
            <AdminIcon name="plus" size={16} /> Ajouter un produit
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {formOpen && (
        <form className="admin-card form form-wide admin-form" onSubmit={handleSubmit}>
          <h2 className="admin-form-title">{editingId ? "Modifier le produit" : "Nouveau produit"}</h2>
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
            <label>Prix<input name="price" value={form.price} onChange={handleChange} required /></label>
          </div>
          <div className="form-row">
            <label>Surface<input name="surface" value={form.surface} onChange={handleChange} /></label>
            <label>Pièces<input type="number" name="rooms" value={form.rooms} onChange={handleChange} /></label>
          </div>
          <ProductMediaManager media={form.media} onChange={(media) => setForm((prev) => ({ ...prev, media }))} />
          <label>Description<textarea name="description" rows={4} value={form.description} onChange={handleChange} /></label>
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
                  <th>Médias</th>
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
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`type-pill type-${product.type === "VENTE" ? "product" : "service"}`}>
                        {product.type === "VENTE" ? "Vente" : "Location"}
                      </span>
                    </td>
                    <td className="admin-status-cell">{product.price}</td>
                    <td className="admin-status-cell muted">{mediaSummary(product)}</td>
                    <td className="admin-actions">
                      <button className="link-btn" onClick={() => openEditForm(product)}>Modifier</button>
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
