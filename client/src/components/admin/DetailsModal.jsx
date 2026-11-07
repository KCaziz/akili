import { useEffect } from "react";

export default function DetailsModal({ title, text, fields = [], onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const visibleFields = fields.filter((field) => field.value);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        {visibleFields.length > 0 && (
          <dl className="modal-fields">
            {visibleFields.map((field) => (
              <div key={field.label} className="modal-field">
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {text ? <p className="modal-body preserve-lines">{text}</p> : <p className="muted">Aucun texte saisi.</p>}
      </div>
    </div>
  );
}
