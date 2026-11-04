import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { TILE_URL, TILE_ATTRIBUTION } from "./leafletSetup";

export default function ProductMap({ latitude, longitude }) {
  const position = [latitude, longitude];
  return (
    <div className="map-frame" dir="ltr">
      <MapContainer center={position} zoom={14} scrollWheelZoom={false} className="map">
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
}
