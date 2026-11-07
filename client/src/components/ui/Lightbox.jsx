import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { resolveMediaUrl } from "../../lib/api";

const SWIPE_THRESHOLD = 50;

// Rendu dans <body> (portal) : un parent animé (transform, cf. ScrollReveal) casserait le position: fixed.
export default function Lightbox({ items, startIndex = 0, onClose }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef(null);
  const total = items.length;

  const previous = useCallback(() => setIndex((current) => (current - 1 + total) % total), [total]);
  const next = useCallback(() => setIndex((current) => (current + 1) % total), [total]);

  useEffect(() => {
    const isRtl = document.documentElement.dir === "rtl";
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") (isRtl ? previous : next)();
      if (event.key === "ArrowLeft") (isRtl ? next : previous)();
    }
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, previous, next]);

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    const isRtl = document.documentElement.dir === "rtl";
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      const swipedTowardStart = delta > 0;
      (swipedTowardStart !== isRtl ? previous : next)();
    }
    touchStartX.current = null;
  }

  const current = items[index];

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="lightbox-topbar" onClick={(event) => event.stopPropagation()}>
        <span className="lightbox-counter">{index + 1} / {total}</span>
        <button type="button" className="lightbox-close" onClick={onClose} aria-label={t("lightbox.close")}>✕</button>
      </div>

      <div
        className="lightbox-stage"
        onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
        onTouchEnd={handleTouchEnd}
      >
        {total > 1 && (
          <button
            type="button"
            className="lightbox-arrow lightbox-arrow-prev"
            onClick={(event) => { event.stopPropagation(); previous(); }}
            aria-label={t("lightbox.previous")}
          >
            ‹
          </button>
        )}

        <figure className="lightbox-figure" onClick={(event) => event.stopPropagation()}>
          <img key={index} className="lightbox-image" src={resolveMediaUrl(current.url)} alt={current.caption || ""} />
          {current.caption && <figcaption className="lightbox-caption">{current.caption}</figcaption>}
        </figure>

        {total > 1 && (
          <button
            type="button"
            className="lightbox-arrow lightbox-arrow-next"
            onClick={(event) => { event.stopPropagation(); next(); }}
            aria-label={t("lightbox.next")}
          >
            ›
          </button>
        )}
      </div>

      {total > 1 && (
        <div className="lightbox-thumbs" onClick={(event) => event.stopPropagation()}>
          {items.map((item, itemIndex) => (
            <button
              key={`${item.url}-${itemIndex}`}
              type="button"
              className={`lightbox-thumb ${itemIndex === index ? "active" : ""}`}
              onClick={() => setIndex(itemIndex)}
            >
              <img src={resolveMediaUrl(item.url)} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}
