import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";
import "../styles/tables.css";
import { fetchScooters } from "../api/scooters";
import { fetchStations } from "../api/stations";
import { useScooterSocket } from "../socket/socket.js";
import Map from "./Map";

export default function DashboardPage() {
  const [scooters, setScooters] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useScooterSocket((update) => {
    setScooters((prev) =>
      prev.map((s) =>
        s.id === update.id
          ? {
              ...s,
              coords: { lat: update.lat, lng: update.lng },
              coordinates: `${update.lat},${update.lng}`,
            }
          : s
      )
    );
  });
  
  useEffect(() => {
    let mounted = true;

    const MIN_LOAD_TIME = 600; // x seconds
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
   console.log("Stations:", stations);
  console.log("Scooters:", scooters);

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
  const openTickets = scooters.filter((s) => s.battery < 20).length;

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
          <div className="stat-label">Open tickets</div>
          <div className="stat-value">{openTickets}</div>
        </div>
      </div>

      {/* ----- MAIN GRID ----- */}
      <div className="section-grid">
        {/* LEFT SIDE */}
        <div>
          <div className="section-title">Map</div>
          <div className="card map-card">
            <div className="map-placeholder">
              <Map
                center={[59.3293, 18.0686]}
                zoom={12}
                markers={[
                  ...stations
                    .filter(s => s.coordinates)
                    .map(s => {
                      const [lat, lng] = s.coordinates.split(",").map(Number);
                      return {
                        position: [lat, lng],
                        popup: s.name,
                        type: "station"
                      };
                    }),

                  ...scooters
                    .filter(s => s.coordinates)
                    .map(s => {
                      const [lat, lng] = s.coordinates.split(",").map(Number);
                      return {
                        position: [lat, lng],
                        popup: `Battery: ${s.battery}%`,
                        type: "scooter",
                        available: s.available
                      };
                    })
                ]}
              />
            </div>
          </div>

          <div className="section" style={{ marginTop: 20 }}>
            <div className="section-title">Active scooters</div>
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
                  {scooters.map((s) => (
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
                      <td>{s.coordinates || "—"}</td>
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
            <div className="section-title">Quick actions</div>

            <div className="quick-actions">
              <button className="btn-primary">Add scooter</button>
              <button className="btn-outline">Export</button>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Recent issues</div>

            <ul className="issues-list">
              <li>S-1003 — Needs service</li>
              <li>S-1002 — Charging</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
