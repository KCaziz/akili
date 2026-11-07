import { useState } from "react";
import { useTranslation } from "react-i18next";
import Lightbox from "../ui/Lightbox";
import { resolveMediaUrl } from "../../lib/api";

export default function ImageGallery({ images, alt }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (!images.length) return <div className="card-image large card-image-empty" />;

  const count = images.length;
  const go = (step) => setIndex((current) => (current + step + count) % count);

  return (
    <div className="image-gallery">
      <div className="image-gallery-main">
        <button type="button" className="image-gallery-open" onClick={() => setFullscreen(true)} aria-label={t("productDetail.openFullscreen")}>
          <img src={resolveMediaUrl(images[index])} alt={`${alt} — ${index + 1}/${count}`} />
        </button>
        {count > 1 && (
          <>
            <button type="button" className="gallery-nav gallery-prev" onClick={() => go(-1)} aria-label={t("productDetail.previous")}>
              ‹
            </button>
            <button type="button" className="gallery-nav gallery-next" onClick={() => go(1)} aria-label={t("productDetail.next")}>
              ›
            </button>
            <span className="photo-count">{index + 1} / {count}</span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="image-gallery-thumbs">
          {images.map((url, thumbIndex) => (
            <button
              key={url + thumbIndex}
              type="button"
              className={`image-gallery-thumb ${thumbIndex === index ? "active" : ""}`}
              onClick={() => setIndex(thumbIndex)}
              aria-label={`${thumbIndex + 1}/${count}`}
              aria-current={thumbIndex === index}
            >
              <img src={resolveMediaUrl(url)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {fullscreen && (
        <Lightbox
          items={images.map((url) => ({ url, caption: alt }))}
          startIndex={index}
          onClose={() => setFullscreen(false)}
        />
      )}
    </div>
  );
}
