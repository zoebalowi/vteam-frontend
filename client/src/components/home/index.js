
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../style/home.css";

// Dummy user data, byt ut mot riktig auth om du har det
const user = { name: "Användare" };
const activeRide = null; // Byt ut mot riktig ride-data om det finns

function Home() {
  const navigate = useNavigate();
  return (
    <div className="page-container home-centered">
      {/* Välkomstmeddelande */}
      <div className="card home-card">
        <h1 className="page-title home-title">
          👋 Välkommen{user?.name ? ", " + user.name : ""}!
        </h1>
        <p className="home-info">
          Här kan du enkelt hyra en el-scooter, se din historik och hantera betalningar.
        </p>
      </div>

      {/* Aktiv uthyrning */}
      <div className="card home-card">
        <div className="section-title home-section-title">
          🚲 Aktiv uthyrning
        </div>
        {activeRide ? (
          <div>
            <p>Du har en aktiv ride: #{activeRide.id}</p>
          </div>
        ) : (
          <p className="home-muted">Ingen aktiv ride just nu.</p>
        )}
      </div>

      {/* Rent bike & Betalningar */}
      <div className="card home-card home-actions">
        <button className="btn-primary home-action-btn">🚲 Rent bike</button>
        <button className="btn-outline home-action-btn" onClick={() => navigate("/payments")}>💳 Betalningar</button>
      </div>

      {/* Historik */}
      <div className="card home-card">
        <div className="section-title home-section-title">
          📜 Historik
        </div>
        <p className="home-muted">Du har inga tidigare rides.</p>
      </div>

      {/* Kontakt/support */}
      <div className="card home-card">
        <div className="section-title home-section-title">
          🆘 Behöver du hjälp?
        </div>
        <button className="btn-outline home-action-btn" style={{ marginTop: 8 }} onClick={() => window.open('mailto:support@example.com')}>Kontakta support</button>
      </div>
    </div>
  );
}

export default Home;