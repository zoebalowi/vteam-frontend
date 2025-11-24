import React from "react";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";
import "../styles/tables.css";
import scooters from "../sampleData/scooters";

export default function ScootersPage() {
  const avgBattery =
    scooters.length > 0
      ? Math.round(scooters.reduce((acc, s) => acc + (s.battery || 0), 0) / scooters.length)
      : 0;

  return (
    <div className="page-container">
      <h1 className="page-title">Scooters</h1>

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
          <div className="stat-value">78</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Open tickets</div>
          <div className="stat-value">12</div>
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
                    <td>{s.model}</td>
                    <td>{s.battery}%</td>
                    <td>{s.status}</td>
                    <td>{s.location}</td>
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