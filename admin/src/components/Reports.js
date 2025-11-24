import React from "react";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";

export default function ReportsPage() {
  return (
    <div className="page-container">
      <h1 className="page-title">Reports</h1>

      {/* ----- TOP WIDGETS ----- */}
      <div className="widgets-grid">
        <div className="card widget-card">
          <div className="stat-label">Total rides</div>
          <div className="stat-value">4,213</div>
          <div className="stat-note">+2.1% (30d)</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Avg ride length</div>
          <div className="stat-value">12m</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Battery health</div>
          <div className="stat-value">88%</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Open alerts</div>
          <div className="stat-value">7</div>
        </div>
      </div>

      {/* ----- MAIN GRID ----- */}
      <div className="section-grid">
        {/* LEFT SIDE */}
        <div>
          <div className="section-title">Key reports</div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 className="section-subtitle">Rides over time</h3>
            <div className="report-placeholder" style={{ height: 220, background: "var(--muted-bg)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
              Chart placeholder
            </div>
          </div>

          <div className="card">
            <h3 className="section-subtitle">Battery health</h3>
            <div className="report-placeholder" style={{ height: 180, background: "var(--muted-bg)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
              Chart placeholder
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside>
          <div className="section">
            <div className="section-title">Quick actions</div>

            <div className="quick-actions">
              <button className="btn-primary">Generate report</button>
              <button className="btn-outline">Export CSV</button>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Recent findings</div>

            <ul className="issues-list">
              <li>High idle times in Zone 3</li>
              <li>Battery degradation 10% on 12 scooters</li>
              <li>Spike in rides last weekend</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
