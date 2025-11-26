import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";
import "../styles/tables.css";
import { fetchStations } from "../api/stations";

export default function StationsPage() {
  const [stations, setStations] = useState([]); // <-- use empty array instead of sample data
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchStations()
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setStations(data);
          setErrorMsg(null);
        } else {
          setStations([]); // explicit fallback
          setErrorMsg("Using local mock data or empty list (no stations from API).");
          console.warn("fetchStations returned empty array or non-array result");
        }
      })
      .catch((err) => {
        if (mounted) {
          setStations([]); // safe fallback
          setErrorMsg(err?.message || "Error fetching stations");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const total = stations.length;
  const active = stations.filter((s) => (s.capacity || 0) > 0).length;
  const totalDocks = stations.reduce((acc, s) => acc + (s.capacity || 0), 0);
  const alerts = stations.filter((s) => (s.capacity || 0) < 5).length;

  return (
    <div className="page-container">
      <h1 className="page-title">Stations</h1>

      {errorMsg && (
        <div style={{ background: "#fff3cd", padding: 10, marginBottom: 12, borderRadius: 4 }}>
          {errorMsg}
        </div>
      )}

      {/* ----- TOP WIDGETS (samma styling som Dashboard) ----- */}
      <div className="widgets-grid">
        <div className="card widget-card">
          <div className="stat-label">Total stations</div>
          <div className="stat-value">{total}</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Active</div>
          <div className="stat-value">{active}</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Available docks</div>
          <div className="stat-value">{totalDocks}</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Alerts</div>
          <div className="stat-value">{alerts}</div>
        </div>
      </div>

      {/* ----- MAIN GRID ----- */}
      <div className="section-grid">
        {/* LEFT SIDE */}
        <div>
          <div className="section-title">Stations</div>
          <div className="card">
            {loading ? (
              <div style={{ padding: 24 }}>Loading stations…</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stations.map((st) => (
                  <div key={st.id} className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="font-semibold">{st.name}</div>
                    <div className="text-sm text-slate-500">Capacity: {st.capacity}</div>
                    <div className="text-sm text-slate-500">Coordinates: {st.coordinates || "—"}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside>
          <div className="section">
            <div className="section-title">Quick actions</div>

            <div className="quick-actions">
              <button className="btn-primary">Add station</button>
              <button className="btn-outline">Export</button>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Recent issues</div>

            <ul className="issues-list">
              <li>Station 3 — Low docks</li>
              <li>Station 5 — Maintenance</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
