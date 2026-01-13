import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";
import "../styles/tables.css";
import { fetchScooters } from "../api/scooters";
import { fetchStations } from "../api/stations";
import Map from "./Map";

export default function DashboardPage() {
  const [scooters, setScooters] = useState([]);
  const [stations, setStations] = useState([]);
  const topStations = [...stations]
    .sort((a, b) => (b.capacity || 0) - (a.capacity || 0))
    .slice(0, 5);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);


  
  useEffect(() => {
    let mounted = true;

    const MIN_LOAD_TIME = 600;
    const startTime = Date.now();

    Promise.all([fetchScooters(), fetchStations()])
      .then(([scootersData, stationsData]) => {
        if (!mounted) return;

        if (Array.isArray(scootersData)) setScooters(scootersData);
        else setScooters([]);

        if (Array.isArray(stationsData)) setStations(stationsData);
        else setStations([]);

        if ((Array.isArray(scootersData) && scootersData.length > 0) || (Array.isArray(stationsData) && stationsData.length > 0)) {
          setErrorMsg(null);
        } else {
          setErrorMsg("Using local mock data or empty lists (no data from API).");
          console.warn("fetch returned empty arrays or non-array results");
        }
      })
      .catch((err) => {
        if (mounted) {
          setErrorMsg(err?.message || "Error fetching data");
          setScooters([]);
          setStations([]);
        }
      })
      .finally(() => {
        if (!mounted) return;

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);

        setTimeout(() => {
          if (mounted) setLoading(false);
        }, remaining);
      });

    return () => (mounted = false);
  }, []);

  // -------- LOADER UI --------
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="loader-text">Loading dashboard...</p>
      </div>
    );
  }

  // -------- STATS --------
  const avgBattery =
    scooters.length > 0
      ? Math.round(
          scooters.reduce((acc, s) => acc + (s.battery || 0), 0) / scooters.length
        )
      : 0;

  const total = scooters.length;
  const activeRides = scooters.filter((s) => s.rented).length;

  const availableDocks = stations.reduce((sum, station) => {
    const scootersAtStation = scooters.filter(s => s.stationId === station.id).length;
    return sum + Math.max(0, (station.capacity || 0) - scootersAtStation);
  }, 0);

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>

      {errorMsg && (
        <div
          style={{
            background: "#fff3cd",
            padding: 10,
            marginBottom: 12,
            borderRadius: 4,
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* ----- TOP WIDGETS ----- */}
      <div className="widgets-grid">
        <div className="card widget-card">
          <div className="stat-label">Total scooters</div>
          <div className="stat-value">{total}</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Average battery</div>
          <div className="stat-value">{avgBattery}%</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Active rides</div>
          <div className="stat-value">{activeRides}</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Available docks</div>
          <div className="stat-value">{availableDocks}</div>
        </div>
      </div>

      {/* ----- MAIN GRID ----- */}
      <div className="section-grid">
        {/* LEFT SIDE */}
        <div>
          <div className="section-title">
            <Link to="/livemap" style={{ textDecoration: "none", color: "inherit" }}>Map</Link>
          </div>
          <div className="card map-card">
            <div className="map-placeholder">
              <Map
                center={[59.3293, 18.0686]}
                zoom={12}
                markers={[ 
                  ...stations
                    .filter(s => s.lat != null && s.lon != null)
                    .map(s => ({
                      position: [s.lat, s.lon],
                      popup: s.name,
                      type: "station"
                    })),

                  ...scooters
                    .filter(s => s.lat != null && s.lon != null)
                    .map(s => ({
                      position: [s.lat, s.lon],
                      popup: `ID: ${s.scooter_id ?? s.id} | Batteri: ${s.battery}%`,
                      type: "scooter",
                      available: s.available,
                      rented: s.rented,
                      battery: s.battery,
                      id: s.scooter_id ?? s.id
                    }))
                ]}
              />
            </div>
          </div>

          <div className="section" style={{ marginTop: 20 }}>
            <div className="section-title">
              <Link to="/scooters" style={{ textDecoration: "none", color: "inherit" }}>Active scooters</Link>
            </div>
            <div className="card">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Battery</th>
                    <th>Status</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {scooters.slice(0, 5).map((s) => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.battery}%</td>
                      <td>
                        {s.rented
                          ? "Rented"
                          : s.available
                          ? "Available"
                          : "Unavailable"}
                      </td>
                      <td>{s.lat != null && s.lon != null ? `${s.lat}, ${s.lon}` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside>
          <div className="section">
            <div className="section-title">
              <Link to="/stations" style={{ textDecoration: "none", color: "inherit" }}>Stations</Link>
            </div>
            <div className="card">
              <table className="table">
                <thead>
                  <tr>
                    <th>Namn</th>
                    <th>Kapacitet</th>
                  </tr>
                </thead>
                <tbody>
                  {topStations.length === 0 && (
                    <tr><td colSpan="2">Inga stationer tillgängliga</td></tr>
                  )}
                  {topStations.map((station) => (
                    <tr key={station.id}>
                      <td>{station.name}</td>
                      <td>{station.capacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
