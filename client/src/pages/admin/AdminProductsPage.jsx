import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import MediaUploadField from "../../components/admin/MediaUploadField";
import { fetchProducts, createProduct, updateProduct, deleteProduct, resolveMediaUrl } from "../../lib/api";

const emptyForm = { title: "", description: "", type: "VENTE", city: "", price: "", surface: "", rooms: "", image: "" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  function load() {
    setStatus("loading");
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
      image: product.image || "",
    });
    setEditingId(product.id);
    setFormOpen(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
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
        <Button onClick={openCreateForm}>+ Ajouter un produit</Button>
      </div>
      <p className="muted">Gestion du catalogue de biens.</p>

      {error && <p className="error">{error}</p>}

      {formOpen && (
        <form className="form form-wide" onSubmit={handleSubmit} style={{ margin: "20px 0" }}>
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
          <MediaUploadField
            label="Image"
            value={form.image}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
          />
          <label>Description<textarea name="description" rows={3} value={form.description} onChange={handleChange} /></label>
          <div style={{ display: "flex", gap: 12 }}>
            <Button type="submit">{editingId ? "Enregistrer" : "Créer"}</Button>
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
                <td>{product.title}</td>
                <td>{product.type === "VENTE" ? "Vente" : "Location"}</td>
                <td>{product.city}</td>
                <td>{product.price}</td>
                <td className="admin-actions">
                  <button className="link-btn" onClick={() => openEditForm(product)}>Modifier</button>
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
