import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/ui/Container";
import { fetchGallery, resolveMediaUrl } from "../lib/api";

export default function GalleryPage() {
  const { t } = useTranslation();
  const [media, setMedia] = useState([]);
  const [status, setStatus] = useState("loading");

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

      <p className="notice">{t("gallery.demoNotice")}</p>

      {status === "loading" && <p className="muted">{t("gallery.loading")}</p>}
      {status === "error" && <p className="notice">{t("gallery.error")}</p>}

      {status === "ready" && (
        <>
          <div className="gallery-grid">
            {photos.map((photo) => (
              <figure key={photo.id} className="gallery-item">
                <img src={resolveMediaUrl(photo.url)} alt={photo.caption || t("gallery.photoAlt")} />
                {photo.caption && <figcaption>{photo.caption}</figcaption>}
              </figure>
            ))}
          </div>

          <h2 className="gallery-section-title">{t("gallery.videosTitle")}</h2>
          {videos.length === 0 ? (
            <div className="gallery-empty">
              <p>{t("gallery.noVideos")}</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {videos.map((video) => (
                <figure key={video.id} className="gallery-item">
                  <video src={resolveMediaUrl(video.url)} controls />
                  {video.caption && <figcaption>{video.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
        </>
      )}
    </Container>
  );
}
