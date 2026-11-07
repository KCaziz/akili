import { useState } from "react";
import { useTranslation } from "react-i18next";
import Lightbox from "../ui/Lightbox";
import { resolveMediaUrl } from "../../lib/api";

export default function PhotoCarousel({ photos, alt }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const total = photos.length;

  if (total === 0) return <div className="carousel-empty" />;

  const current = photos[Math.min(index, total - 1)];

  return (
    <div className="carousel">
      <div className="carousel-main">
        <button type="button" className="carousel-image-btn" onClick={() => setFullscreen(true)} aria-label={t("productDetail.enlarge")}>
          <img key={index} className="carousel-image" src={resolveMediaUrl(current.url)} alt={alt} />
          <span className="carousel-zoom" aria-hidden="true">⤢</span>
        </button>

        {total > 1 && (
          <>
            <button
              type="button"
              className="carousel-arrow carousel-arrow-prev"
              onClick={() => setIndex((value) => (value - 1 + total) % total)}
              aria-label={t("lightbox.previous")}
            >
              ‹
            </button>
            <button
              type="button"
              className="carousel-arrow carousel-arrow-next"
              onClick={() => setIndex((value) => (value + 1) % total)}
              aria-label={t("lightbox.next")}
            >
              ›
            </button>
            <span className="carousel-counter">{index + 1} / {total}</span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="carousel-thumbs">
          {photos.map((photo, photoIndex) => (
            <button
              key={`${photo.url}-${photoIndex}`}
              type="button"
              className={`carousel-thumb ${photoIndex === index ? "active" : ""}`}
              onClick={() => setIndex(photoIndex)}
            >
              <img src={resolveMediaUrl(photo.url)} alt="" />
            </button>
          ))}
        </div>
      )}

      {fullscreen && <Lightbox items={photos} startIndex={index} onClose={() => setFullscreen(false)} />}
    </div>
  );
}
