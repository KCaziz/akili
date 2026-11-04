import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { resolveMediaUrl } from "../../lib/api";

const SWIPE_THRESHOLD = 50;

export default function Lightbox({ images, index, onChange, onClose, alt }) {
  const { t, i18n } = useTranslation();
  const touchStartX = useRef(null);
  const closeRef = useRef(null);
  const rtl = i18n.dir() === "rtl";
  const count = images.length;
  const go = (step) => onChange((index + step + count) % count);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") onClose();
      // En arabe la lecture va de droite à gauche : la flèche droite recule.
      if (event.key === "ArrowRight") onChange((index + (rtl ? -1 : 1) + count) % count);
      if (event.key === "ArrowLeft") onChange((index + (rtl ? 1 : -1) + count) % count);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [index, count, rtl, onChange, onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    const towardStart = delta > 0;
    go(towardStart !== rtl ? -1 : 1);
  }

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      onTouchStart={(event) => (touchStartX.current = event.touches[0].clientX)}
      onTouchEnd={handleTouchEnd}
    >
      <button ref={closeRef} type="button" className="lightbox-close" onClick={onClose} aria-label={t("productDetail.close")}>
        ✕
      </button>
      <img
        className="lightbox-image"
        src={resolveMediaUrl(images[index])}
        alt={`${alt} — ${index + 1}/${count}`}
        onClick={(event) => event.stopPropagation()}
      />
      {count > 1 && (
        <>
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
            }}
            aria-label={t("productDetail.previous")}
          >
            ‹
          </button>
          <button
            type="button"
            className="lightbox-nav lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            aria-label={t("productDetail.next")}
          >
            ›
          </button>
          <span className="lightbox-counter">
            {index + 1} / {count}
          </span>
        </>
      )}
    </div>,
    document.body,
  );
}
