import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";
import "../styles/tables.css";
import { fetchScooters } from "../api/scooters";
import "../styles/price-control.css";
import { getPrice, updatePrice } from "../api/price";

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

  // Pris per minut state
  const [price, setPrice] = useState(0);
  const [editPrice, setEditPrice] = useState(false);
  const [inputPrice, setInputPrice] = useState(0);
  const [savingPrice, setSavingPrice] = useState(false);
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    getPrice().then(p => {
      setPrice(p.perMinute);
      setInputPrice(p.perMinute);
    }).catch(() => setPrice(0.25));
  }, []);

  async function handleSavePrice() {
    setSavingPrice(true);
    setPriceError("");
    try {
      await updatePrice({ price: Number(inputPrice) });
      setPrice(Number(inputPrice));
      setEditPrice(false);
    } catch (e) {
      setPriceError("Kunde inte spara priset");
    }
    setSavingPrice(false);
  }
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
                  <th>Battery</th>
                  <th>Status</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {scooters.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
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
            <div className="section-title">Ändra pris på resa</div>
            <div className="price-control-container">
              <div className="price-control-label">Pris per minut (kr):</div>
              <div className="price-control-value-row">
                <span className="price-control-value">{price.toFixed(2)}</span>
                {!editPrice && (
                  <button className="price-control-btn" onClick={() => setEditPrice(true)}>Ändra</button>
                )}
              </div>
              {editPrice && (
                <div className="price-control-edit-row">
                  <input
                    className="price-control-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={inputPrice}
                    onChange={e => setInputPrice(e.target.value)}
                  />
                  <button className="price-control-btn" onClick={handleSavePrice} disabled={savingPrice}>Spara</button>
                  <button className="price-control-btn" onClick={() => { setEditPrice(false); setInputPrice(price); }}>Avbryt</button>
                </div>
              )}
              {priceError && <div className="price-control-error">{priceError}</div>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
