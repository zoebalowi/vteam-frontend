import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";
import "../styles/tables.css";
import { fetchStations } from "../api/stations";

export default function StationsPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    const MIN_LOAD_TIME = 600;
    const startTime = Date.now();

    fetchStations()
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) {
          setStations(data);
          setErrorMsg(null);
        } else {
          setStations([]);
          setErrorMsg("No stations from API (empty list).");
        }
      })
      .catch((err) => {
        if (mounted) {
          setStations([]);
          setErrorMsg(err?.message || "Error fetching stations");
        }
      })
      .finally(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);
        setTimeout(() => mounted && setLoading(false), remaining);
      });

    return () => {
      mounted = false;
    };
  }, []);

  /* -------- SEARCH & SORT STATE -------- */
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  /* -------- FILTER & SORT -------- */
  const filteredStations = stations
    .filter((s) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        (s.name || "").toLowerCase().includes(q) ||
        String(s.id).includes(q)
      );
    })
    .sort((a, b) => {
      const A = (a[sortKey] ?? "").toString().toLowerCase();
      const B = (b[sortKey] ?? "").toString().toLowerCase();
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  /* -------- STATS -------- */
  const total = stations.length;
  const active = stations.filter((s) => (s.capacity || 0) > 0).length;
  const totalDocks = stations.reduce((acc, s) => acc + (s.capacity || 0), 0);
  const alerts = stations.filter((s) => (s.capacity || 0) < 5).length;

  /* -------- LOADING -------- */
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="loader-text">Loading stations...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Stations</h1>

      {errorMsg && (
        <div style={{ background: "#fff3cd", padding: 10, marginBottom: 12, borderRadius: 4 }}>
          {errorMsg}
        </div>
      )}

      {/* ----- TOP WIDGETS ----- */}
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
          <div className="section-title">All stations</div>
          <div className="card">

            {/* SEARCH + SORT */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <input
                type="search"
                placeholder="Search by station name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  minWidth: 220,
                }}
              />

              <button className="btn-outline" onClick={() => toggleSort("name")}>
                Sort: {sortKey} {sortDir === "asc" ? "↑" : "↓"}
              </button>
            </div>

            {/* TABLE */}
            <table className="table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th style={{ width: 120 }}>Capacity</th>
                  <th>Coordinates</th>
                </tr>
              </thead>
              <tbody>
                {filteredStations.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: 20 }}>
                      No stations found
                    </td>
                  </tr>
                ) : (
                  filteredStations.map((st) => (
                    <tr key={st.id}>
                      <td style={{ fontWeight: 600 }}>{st.name}</td>
                      <td>{st.capacity ?? 0}</td>
                      <td style={{ fontSize: 13, color: "#6b7280" }}>
                        {st.coordinates || "—"}
                      </td>
                    </tr>
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
              <button className="btn-primary">Add station</button>
              <button className="btn-outline">Export</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
