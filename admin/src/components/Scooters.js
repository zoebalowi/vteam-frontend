import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";
import "../styles/tables.css";
import { fetchScooters } from "../api/scooters";

export default function ScootersPage() {
  const [scooters, setScooters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    const MIN_LOAD_TIME = 600; // x sekunder
    const startTime = Date.now();

    fetchScooters()
      .then((data) => {
        if (!mounted) return;

        if (Array.isArray(data) && data.length > 0) {
          setScooters(data);
        } else {
          setScooters([]);
          setErrorMsg("Using empty scooter list (no scooters from API).");
          console.warn("fetchScooters returned empty array or non-array result");
        }
      })
      .catch((err) => {
        if (mounted) {
          setScooters([]);
          setErrorMsg(err?.message || "Error fetching scooters");
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

    return () => {
      mounted = false;
    };
  }, []);

  const avgBattery =
    scooters.length > 0
      ? Math.round(
          scooters.reduce((acc, s) => acc + (s.battery || 0), 0) / scooters.length
        )
      : 0;

  // -------------------------
  // GLOBAL LOADER (same as Dashboard)
  // -------------------------
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="loader-text">Loading scooters...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Scooters</h1>

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
          <div className="stat-value">{scooters.length}</div>
          <div className="stat-note">+1.2% (30d)</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Average battery</div>
          <div className="stat-value">{avgBattery}%</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Active rides</div>
          <div className="stat-value">
            {scooters.filter((s) => s.rented).length}
          </div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Open tickets</div>
          <div className="stat-value">
            {scooters.filter((s) => s.battery < 20).length}
          </div>
        </div>
      </div>

      {/* ----- MAIN GRID ----- */}
      <div className="section-grid">
        {/* LEFT SIDE */}
        <div>
          <div className="section-title">All scooters</div>
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Model</th>
                  <th>Battery</th>
                  <th>Status</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {scooters.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.model || "—"}</td>
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
