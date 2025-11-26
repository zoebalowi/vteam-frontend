import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";
import "../styles/tables.css";
import { fetchUsers } from "../api/users";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchUsers()
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
          setErrorMsg(null);
        } else {
          setUsers([]);
          setErrorMsg("No users from API (showing empty list).");
          console.warn("fetchUsers returned empty array or non-array result");
        }
      })
      .catch((err) => {
        if (mounted) {
          setUsers([]); // safe fallback
          setErrorMsg(err?.message || "Error fetching users");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const total = users.length;
  const active7d = total; // placeholder — no rentals fetch implemented
  const avgRides = 0; // placeholder for now
  const openTickets = 0; // placeholder for now

  return (
    <div className="page-container">
      <h1 className="page-title">Users</h1>

      {errorMsg && (
        <div style={{ background: "#fff3cd", padding: 10, marginBottom: 12, borderRadius: 4 }}>
          {errorMsg}
        </div>
      )}

      {/* ----- TOP WIDGETS ----- */}
      <div className="widgets-grid">
        <div className="card widget-card">
          <div className="stat-label">Total users</div>
          <div className="stat-value">{total}</div>
          <div className="stat-note">+0.8% (30d)</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Active (7d)</div>
          <div className="stat-value">{active7d}</div>
        </div>

        <div className="card widget-card">
          <div className="stat-label">Avg rides/user</div>
          <div className="stat-value">{avgRides}</div>
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
          <div className="section-title">All users</div>
          <div className="card">
            {loading ? (
              <div style={{ padding: 24 }}>Loading users…</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((u) => (
                  <div key={u.id} className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-200" />
                      <div>
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-sm text-slate-500">{u.email}</div>
                      </div>
                    </div>
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
