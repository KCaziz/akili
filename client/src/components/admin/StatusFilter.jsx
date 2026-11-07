import { filterByStatus } from "../../lib/status";

const OPTIONS = [
  { value: "ALL", label: "Toutes" },
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "TRAITE", label: "Traitées" },
];

export default function StatusFilter({ items, value, onChange }) {
  return (
    <div className="segmented" role="tablist">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          className={`segmented-option ${value === option.value ? "active" : ""}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          <span className="segmented-count">{filterByStatus(items, option.value).length}</span>
        </button>
      ))}
    </div>
  );
}
