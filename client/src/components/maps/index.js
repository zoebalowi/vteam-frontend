import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "../../style/maps.css";
import { fetchScooters } from "../../api/scooters";
import { startRental } from "../../api/rentals";
import { getToken } from "../../authUtils";

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
  const [userId, setUserId] = useState(null);
  const [renting, setRenting] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Get user_id from token
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.user_id);
      } catch (err) {
        console.error("Failed to parse token:", err);
      }
    }

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

  const handleRentScooter = async (scooterId) => {
    if (!userId) {
      alert("Kunde inte hitta användar-ID");
      return;
    }
    if (renting) return;

    setRenting(true);
    try {
      await startRental(userId, scooterId);
      alert("Scooter uthyrd! Gå till Home för att se din aktiva resa.");
      // Refresh scooters
      const data = await fetchScooters();
      setScooters(data);
    } catch (err) {
      alert("Kunde inte hyra scooter: " + err.message);
    } finally {
      setRenting(false);
    }
  };

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
                key={scooter.scooter_id}
                position={[scooter.lat || 59.3293, scooter.lon || 18.0686]}
              >
                <Popup>
                  <div className="popup-content">
                    <strong>Scooter {scooter.scooter_id}</strong>
                    <p>Batteri: {scooter.battery}%</p>
                    <p>Status: {scooter.rented ? "Uthyrd" : "Tillgänglig"}</p>
                    {!scooter.rented && scooter.available ? (
                      <button 
                        className="btn-small" 
                        onClick={() => handleRentScooter(scooter.scooter_id)}
                        disabled={renting}
                      >
                        {renting ? "Hyr..." : "Hyr nu"}
                      </button>
                    ) : (
                      <button className="btn-small" disabled>Ej tillgänglig</button>
                    )}
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