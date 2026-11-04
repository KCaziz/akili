import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import TruncatedText from "../../components/admin/TruncatedText";
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
      <div className="admin-header-row">
        <h1>Avis clients</h1>
        <Button onClick={() => openForm(null)}>+ Ajouter un avis</Button>
      </div>
      <p className="muted">
        Avis affichés sur la page d'accueil. N'y mettez que de vrais témoignages de clients, avec leur accord.
        La section est masquée tant qu'aucun avis n'est publié.
      </p>

      {error && <p className="error">{error}</p>}

      {formOpen && (
        <form className="form form-wide" onSubmit={handleSubmit} style={{ margin: "20px 0" }}>
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
          <div style={{ display: "flex", gap: 12 }}>
            <Button type="submit">{editingId ? "Enregistrer" : "Créer"}</Button>
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Annuler</Button>
          </div>
        </form>
      )}

      {status === "loading" && <p className="muted">Chargement…</p>}
      {status === "ready" && testimonials.length === 0 && <p className="muted">Aucun avis pour le moment.</p>}

      {status === "ready" && testimonials.length > 0 && (
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
                <td>{testimonial.name}{testimonial.city && <div className="muted">{testimonial.city}</div>}</td>
                <td>{testimonial.rating} / 5</td>
                <td className="admin-description-cell"><TruncatedText text={testimonial.text} title={`Avis de ${testimonial.name}`} /></td>
                <td>
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
      )}
    </>
  );
}
