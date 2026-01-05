import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "../../style/maps.css";
import { fetchScooters } from "../../api/scooters";

// Fix för Leaflet marker-ikon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function Maps() {
  const [scooters, setScooters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "available", "lowbattery"

  useEffect(() => {
    let mounted = true;

    fetchScooters()
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setScooters(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching scooters:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => (mounted = false);
  }, []);

  // Filter scooters baserat på valt filter
  const filteredScooters = scooters.filter((s) => {
    if (filter === "available") return s.available && !s.rented;
    if (filter === "lowbattery") return s.battery < 20;
    return true;
  });

  if (loading) {
    return <p>Loading map...</p>;
  }

  // Standardposition (Stockholm)
  const mapCenter = [59.3293, 18.0686];

  return (
    <div className="page-container home-centered">
      <div className="card home-card">
        <h1 className="page-title home-title">Scooter Map</h1>
        <div className="home-actions" style={{ marginBottom: 16 }}>
          <button
            className={filter === "all" ? "btn-filter active home-action-btn" : "btn-filter home-action-btn"}
            onClick={() => setFilter("all")}
          >
            Alla scooters ({scooters.length})
          </button>
          <button
            className={filter === "available" ? "btn-filter active home-action-btn" : "btn-filter home-action-btn"}
            onClick={() => setFilter("available")}
          >
            Tillgängliga ({scooters.filter((s) => s.available && !s.rented).length})
          </button>
          <button
            className={filter === "lowbattery" ? "btn-filter active home-action-btn" : "btn-filter home-action-btn"}
            onClick={() => setFilter("lowbattery")}
          >
            Låg batteri ({scooters.filter((s) => s.battery < 20).length})
          </button>
        </div>
        <div className="map-wrapper" style={{ marginBottom: 16 }}>
          <MapContainer center={mapCenter} zoom={13} className="map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {filteredScooters.map((scooter) => (
              <Marker
                key={scooter.id}
                position={[scooter.latitude || 59.3293, scooter.longitude || 18.0686]}
              >
                <Popup>
                  <div className="popup-content">
                    <strong>Scooter {scooter.id}</strong>
                    <p>Batteri: {scooter.battery}%</p>
                    <p>Status: {scooter.rented ? "Uthyrd" : "Tillgänglig"}</p>
                    <button className="btn-small">Hyr nu</button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className="home-muted" style={{ marginTop: 8 }}>
          Visar {filteredScooters.length} scooters på kartan
        </div>
      </div>
    </div>
  );
}

export default Maps;