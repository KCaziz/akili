import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import TruncatedText from "../../components/admin/TruncatedText";
import AdminIcon from "../../components/admin/AdminIcon";
import { fetchAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "../../lib/api";

const emptyForm = { name: "", city: "", text: "", rating: 5, isPublished: true };

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  function load() {
    fetchAllTestimonials()
      .then((data) => {
        setTestimonials(data);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }

  useEffect(load, []);

  function openForm(testimonial) {
    setForm(testimonial ? { ...emptyForm, ...testimonial, city: testimonial.city || "" } : emptyForm);
    setEditingId(testimonial?.id ?? null);
    setFormOpen(true);
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function save(id, data) {
    setError(null);
    try {
      if (id) await updateTestimonial(id, data);
      else await createTestimonial(data);
      load();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (await save(editingId, { ...form, rating: Number(form.rating) })) setFormOpen(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer cet avis ?")) return;
    try {
      await deleteTestimonial(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Avis clients</h1>
          <p className="muted">
            Avis affichés sur la page d'accueil. N'y mettez que de vrais témoignages de clients, avec leur accord.
            La section est masquée tant qu'aucun avis n'est publié.
          </p>
        </div>
        {!formOpen && (
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => openForm(null)}>
            <AdminIcon name="plus" size={16} /> Ajouter un avis
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {formOpen && (
        <form className="admin-card form form-wide admin-form" onSubmit={handleSubmit}>
          <h2 className="admin-form-title">{editingId ? "Modifier l'avis" : "Nouvel avis"}</h2>
          <div className="form-row">
            <label>Nom du client<input name="name" value={form.name} onChange={handleChange} required /></label>
            <label>Ville (facultatif)<input name="city" value={form.city} onChange={handleChange} /></label>
          </div>
          <label>Avis<textarea name="text" rows={4} value={form.text} onChange={handleChange} required maxLength={2000} /></label>
          <div className="form-row">
            <label>Note
              <select name="rating" value={form.rating} onChange={handleChange}>
                {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} / 5</option>)}
              </select>
            </label>
            <label className="checkbox"><input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} /> Publié sur le site</label>
          </div>
          <div className="admin-form-actions">
            <Button type="submit">{editingId ? "Enregistrer" : "Créer"}</Button>
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Annuler</Button>
          </div>
        </form>
      )}

      {status === "loading" && <div className="skeleton skeleton-table" />}
      {status === "ready" && testimonials.length === 0 && <div className="admin-empty">Aucun avis pour le moment.</div>}

      {status === "ready" && testimonials.length > 0 && (
        <div className="admin-card admin-table-card">
          <div className="table-scroll">
            <table className="admin-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Note</th>
              <th>Avis</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((testimonial) => (
              <tr key={testimonial.id}>
                <td>
                  <strong className="cell-title">{testimonial.name}</strong>
                  {testimonial.city && <span className="cell-sub">{testimonial.city}</span>}
                </td>
                <td className="admin-status-cell rating-cell">{"★".repeat(testimonial.rating)}<span>{"★".repeat(5 - testimonial.rating)}</span></td>
                <td className="admin-description-cell"><TruncatedText text={testimonial.text} title={`Avis de ${testimonial.name}`} /></td>
                <td className="admin-status-cell">
                  <span className={`badge badge-${testimonial.isPublished ? "done" : "pending"}`}>
                    {testimonial.isPublished ? "publié" : "masqué"}
                  </span>
                </td>
                <td className="admin-actions">
                  <button className="link-btn" onClick={() => openForm(testimonial)}>Modifier</button>
                  <button className="link-btn" onClick={() => save(testimonial.id, { ...testimonial, isPublished: !testimonial.isPublished })}>
                    {testimonial.isPublished ? "Masquer" : "Publier"}
                  </button>
                  <button className="link-btn danger" onClick={() => handleDelete(testimonial.id)}>Supprimer</button>
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
