import { useState } from "react";
import DetailsModal from "./DetailsModal";

const PREVIEW_LENGTH = 70;

export default function TruncatedText({ text, title = "Détail" }) {
  const [open, setOpen] = useState(false);
  const value = text || "";
  const isLong = value.length > PREVIEW_LENGTH;

  return (
    <>
      <span className="admin-text-preview">{value}</span>
      {isLong && (
        <button type="button" className="link-btn admin-text-more" onClick={() => setOpen(true)}>
          Voir détails
        </button>
      )}
      {open && <DetailsModal title={title} text={value} onClose={() => setOpen(false)} />}
    </>
  );
}
