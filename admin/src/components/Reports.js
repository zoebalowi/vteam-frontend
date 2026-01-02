
import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";
import { getPrice, updatePrice } from "../api/price";

export default function ReportsPage() {
  const defaultPerMinute = 0.25;
  const [perMinute, setPerMinute] = useState(defaultPerMinute);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchPrice() {
      setLoading(true);
      try {
        if (!token) throw new Error("No token");
        const data = await getPrice(token);
        setPerMinute(data.perMinute ?? defaultPerMinute);
      } catch (e) {
        setStatusMessage("Failed to load pricing");
      } finally {
        setLoading(false);
      }
    }
    fetchPrice();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const value = parseFloat(e.target.value);
    setPerMinute(Number.isNaN(value) ? "" : value);
  };

  const savePricing = async () => {
    if (perMinute < 0) {
      setStatusMessage("Please enter a non-negative value.");
      return;
    }
    try {
      if (!token) throw new Error("No token");
      await updatePrice({ perMinute }, token);
      setStatusMessage("Saved");
    } catch (e) {
      setStatusMessage("Failed to save");
    }
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const resetPricing = () => {
    setPerMinute(defaultPerMinute);
    setStatusMessage("Reset to default (not saved)");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Reports</h1>

      {/* ----- TOP WIDGETS ----- */}
      <div className="widgets-grid">
        <div className="card widget-card">
          <div className="stat-label">Total rides</div>
          <div className="stat-value">4,213</div>
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

          <div className="section">
            <div className="section-title">Pricing settings</div>

            <div className="card">

              <label className="field-label">Cost per minute (SEK)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={perMinute}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              />

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button className="btn-primary" onClick={savePricing} disabled={loading}>Save</button>
                <button className="btn-outline" onClick={resetPricing} disabled={loading}>Reset</button>
              </div>

              {loading && <div style={{ marginTop: 8, color: "var(--muted)" }}>Loading...</div>}
              {statusMessage && <div style={{ marginTop: 8, color: "var(--muted)" }}>{statusMessage}</div>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
