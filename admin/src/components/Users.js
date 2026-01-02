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
    const MIN_LOAD_TIME = 600; // x sek
    const startTime = Date.now();

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
          setUsers([]); 
          setErrorMsg(err?.message || "Error fetching users");
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

  // UI state for search/sort
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  /** LOADING SCREEN */
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="loader-text">Loading users...</p>
      </div>
    );
  }

  const total = users.length;
  const active7d = total;
  const avgRides = 0;
  const openTickets = 0;

  function toggleSort(key) {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const filteredUsers = users
    .filter((u) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || String(u.id).includes(q);
    })
    .sort((a, b) => {
      const A = (a[sortKey] ?? '').toString().toLowerCase();
      const B = (b[sortKey] ?? '').toString().toLowerCase();
      if (A < B) return sortDir === 'asc' ? -1 : 1;
      if (A > B) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <input
                type="search"
                placeholder="Search by name or email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd', minWidth: 220 }}
              />

              <div>
                <button
                  className="btn-outline"
                  onClick={() => toggleSort('name')}
                  style={{ marginRight: 8 }}
                >
                  Sort: {sortKey} {sortDir === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>

            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th style={{ width: 140 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: 20 }}>No users found</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <React.Fragment key={u.id}>
                      <tr>
                        <td>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                        </td>
                        <td style={{ fontSize: 13, color: '#6b7280' }}>{u.email}</td>
                        <td>
                          <div>{u.hashed_password ? 'Active' : 'Invited'}</div>
                        </td> 
                      </tr>


                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
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
        </aside>
      </div>
    </div>
  );
}
