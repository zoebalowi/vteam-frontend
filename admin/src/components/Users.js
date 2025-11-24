import React from "react";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";
import "../styles/tables.css";

export default function UsersPage() {
  const users = ["Anna", "Johan", "Fatima", "Lars"];

  return (
    <div className="page-container">
      <h1 className="page-title">Users</h1>

      {/* ----- TOP WIDGETS ----- */}
      <div className="widgets-grid">
        <div className="card widget-card">
          <div className="stat-label">Total users</div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-note">+0.8% (30d)</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Active (7d)</div>
          <div className="stat-value">3</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Avg rides/user</div>
          <div className="stat-value">4.2</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Open tickets</div>
          <div className="stat-value">2</div>
        </div>
      </div>

      {/* ----- MAIN GRID ----- */}
      <div className="section-grid">
        {/* LEFT SIDE */}
        <div>
          <div className="section-title">All users</div>
          <div className="card">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((u) => (
                <div key={u} className="p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200" />
                    <div>
                      <div className="font-semibold">{u}</div>
                      <div className="text-sm text-slate-500">
                        Last ride: 2 days ago
                      </div>
                    </div>
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
              <button className="btn-primary">Add user</button>
              <button className="btn-outline">Export</button>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Recent issues</div>
            <ul className="issues-list">
              <li>Fatima — Password reset</li>
              <li>Johan — Billing question</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
