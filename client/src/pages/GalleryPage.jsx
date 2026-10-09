import { useEffect, useState } from "react";
import Container from "../components/ui/Container";
import { fetchGallery, resolveMediaUrl } from "../lib/api";

export default function GalleryPage() {
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
      <span className="eyebrow">Galerie</span>
      <h1>Photos &amp; vidéos de l'agence</h1>
      <p className="lead">Découvrez nos locaux, notre équipe et nos événements en images.</p>

      <p className="notice">
        Photos illustratives pour cette version de démonstration — à remplacer par les vraies
        photos et vidéos de l'agence Akili.
      </p>

      {status === "loading" && <p className="muted">Chargement…</p>}
      {status === "error" && <p className="notice">Impossible de charger la galerie.</p>}

      {status === "ready" && (
        <>
          <div className="gallery-grid">
            {photos.map((photo) => (
              <figure key={photo.id} className="gallery-item">
                <img src={resolveMediaUrl(photo.url)} alt={photo.caption || "Photo de l'agence"} />
                {photo.caption && <figcaption>{photo.caption}</figcaption>}
              </figure>
            ))}
          </div>

          <h2 className="gallery-section-title">Vidéos</h2>
          {videos.length === 0 ? (
            <div className="gallery-empty">
              <p>
                Aucune vidéo n'a encore été fournie par l'agence. Cette section affichera les
                vidéos de présentation d'Akili dès qu'elles seront disponibles.
              </p>
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
