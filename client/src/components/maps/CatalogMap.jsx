import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { TILE_URL, TILE_ATTRIBUTION, DEFAULT_CENTER } from "./leafletSetup";
import { formatProductPrice, productImages } from "../../lib/format";
import { resolveMediaUrl } from "../../lib/api";

function FitToMarkers({ positions }) {
  const map = useMap();
  // Clé stable : sans elle, chaque re-rendu du parent recentrerait la carte pendant que l'utilisateur la déplace.
  const key = JSON.stringify(positions);
  useEffect(() => {
    const points = JSON.parse(key);
    if (points.length === 1) map.setView(points[0], 13);
    else if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
  }, [map, key]);
  return null;
}

export default function CatalogMap({ products }) {
  const { t } = useTranslation();
  const located = products.filter((product) => product.latitude !== null && product.longitude !== null);
  const positions = located.map((product) => [product.latitude, product.longitude]);

  return (
    <>
      {located.length < products.length && (
        <p className="muted">{t("products.mapUnlocated", { count: products.length - located.length })}</p>
      )}
      <div className="map-frame map-frame-large" dir="ltr">
        <MapContainer center={DEFAULT_CENTER} zoom={6} className="map">
          <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
          <FitToMarkers positions={positions} />
          {located.map((product) => {
            const cover = productImages(product)[0];
            return (
              <Marker key={product.id} position={[product.latitude, product.longitude]}>
                <Popup>
                  <Link to={`/produits/${product.id}`} className="map-popup">
                    {cover && <img src={resolveMediaUrl(cover)} alt="" />}
                    <strong>{product.title}</strong>
                    <span>{formatProductPrice(product, t)}</span>
                  </Link>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </>
  );
}
