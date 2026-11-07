import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/ui/Container";
import Lightbox from "../components/ui/Lightbox";
import { fetchGallery, resolveMediaUrl } from "../lib/api";

export default function GalleryPage() {
  const { t } = useTranslation();
  const [media, setMedia] = useState([]);
  const [status, setStatus] = useState("loading");
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchGallery()
      .then((data) => {
        if (!cancelled) {
          setMedia(data);
          setStatus("ready");
        }
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  const photos = media.filter((item) => item.type === "PHOTO");
  const videos = media.filter((item) => item.type === "VIDEO");

  return (
    <Container className="section">
      <span className="eyebrow">{t("gallery.eyebrow")}</span>
      <h1>{t("gallery.title")}</h1>
      <p className="lead">{t("gallery.lead")}</p>

      {status === "loading" && <p className="muted">{t("gallery.loading")}</p>}
      {status === "error" && <p className="notice">{t("gallery.error")}</p>}

      {status === "ready" && (
        <>
          <div className="gallery-grid">
            {photos.map((photo, index) => (
              <figure key={photo.id} className="gallery-item">
                <button type="button" className="gallery-open" onClick={() => setOpenIndex(index)}>
                  <img src={resolveMediaUrl(photo.url)} alt={photo.caption || t("gallery.photoAlt")} />
                  <span className="gallery-zoom" aria-hidden="true">⤢</span>
                </button>
                {photo.caption && <figcaption>{photo.caption}</figcaption>}
              </figure>
            ))}
          </div>

          {videos.length > 0 && (
            <>
              <h2 className="gallery-section-title">{t("gallery.videosTitle")}</h2>
              <div className="gallery-grid">
                {videos.map((video) => (
                  <figure key={video.id} className="gallery-item">
                    <video src={resolveMediaUrl(video.url)} controls preload="metadata" />
                    {video.caption && <figcaption>{video.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {openIndex !== null && (
        <Lightbox items={photos} startIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </Container>
  );
}
