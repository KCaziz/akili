import { useState } from "react";
import DetailsModal from "./DetailsModal";

export default function TruncatedText({ text, title = "Détail", fields }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span className="admin-text-preview">{text || <span className="muted">—</span>}</span>
      <button type="button" className="link-btn admin-text-more" onClick={() => setOpen(true)}>
        Voir détails
      </button>
      {open && <DetailsModal title={title} text={text} fields={fields} onClose={() => setOpen(false)} />}
    </>
  );
}
