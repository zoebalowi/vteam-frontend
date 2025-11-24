import React from "react";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";
import "../styles/tables.css";

export default function StationsPage() {
  return (
    <div className="page-container">
      <h1 className="page-title">Stations</h1>

      {/* ----- TOP WIDGETS (samma styling som Dashboard) ----- */}
      <div className="widgets-grid">
        <div className="card widget-card">
          <div className="stat-label">Total stations</div>
          <div className="stat-value">5</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Active</div>
          <div className="stat-value">4</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Available docks</div>
          <div className="stat-value">42</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Alerts</div>
          <div className="stat-value">1</div>
        </div>
      </div>

      {/* ----- MAIN GRID ----- */}
      <div className="section-grid">
        {/* LEFT SIDE */}
        <div>
          <div className="section-title">Stations</div>
          <div className="card">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 bg-white rounded-xl shadow-sm">
                  <div className="font-semibold">Station {i}</div>
                  <div className="text-sm text-slate-500">
                    Address: Examplevägen {i}
                  </div>
                </div>
              ))}
            </div>
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
