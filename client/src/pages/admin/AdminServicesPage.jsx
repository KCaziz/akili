import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import { fetchServices, createService, updateService, deleteService } from "../../lib/api";

const emptyForm = { title: "", description: "" };

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  function load() {
    setStatus("loading");
    fetchServices()
      .then((data) => {
        setServices(data);
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

  function openEditForm(service) {
    setForm({ title: service.title, description: service.description || "" });
    setEditingId(service.id);
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
        await updateService(editingId, form);
      } else {
        await createService(form);
      }
      setFormOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer ce service ?")) return;
    try {
      await deleteService(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="admin-header-row">
        <h1>Services</h1>
        <Button onClick={openCreateForm}>+ Ajouter un service</Button>
      </div>
      <p className="muted">Gestion des services proposés par l'agence.</p>

      {error && <p className="error">{error}</p>}

      {formOpen && (
        <form className="form form-wide" onSubmit={handleSubmit} style={{ margin: "20px 0" }}>
          <label>Titre<input name="title" value={form.title} onChange={handleChange} required /></label>
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
              <th>Titre</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.title}</td>
                <td className="admin-description-cell">{service.description}</td>
                <td className="admin-actions">
                  <button className="link-btn" onClick={() => openEditForm(service)}>Modifier</button>
                  <button className="link-btn danger" onClick={() => handleDelete(service.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
