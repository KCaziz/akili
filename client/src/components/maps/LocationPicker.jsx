import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { TILE_URL, TILE_ATTRIBUTION, DEFAULT_CENTER } from "./leafletSetup";

function ClickToPlace({ onPick }) {
  useMapEvents({
    click(event) {
      onPick(Number(event.latlng.lat.toFixed(6)), Number(event.latlng.lng.toFixed(6)));
    },
  });
  return null;
}

// Carte de l'admin : un clic place (ou déplace) le bien.
export default function LocationPicker({ latitude, longitude, onPick }) {
  const hasPosition = latitude !== "" && longitude !== "" && latitude !== null && longitude !== null;
  const position = hasPosition ? [Number(latitude), Number(longitude)] : null;

  return (
    <div className="map-frame" dir="ltr">
      <MapContainer center={position || DEFAULT_CENTER} zoom={position ? 14 : 6} className="map">
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <ClickToPlace onPick={onPick} />
        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
}
