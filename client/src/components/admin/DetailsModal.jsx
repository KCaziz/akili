import { useEffect } from "react";

export default function DetailsModal({ title, text, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="link-btn" onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        <p className="modal-body preserve-lines">{text}</p>
      </div>
    </div>
  );
}
