
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/home.css";
import { fetchRentals, endRental } from "../../api/rentals";
import { getToken } from "../../authUtils";
import { MdOutlineElectricScooter, MdAttachMoney } from "react-icons/md";
import { TfiAlarmClock } from "react-icons/tfi";


function Home() {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const loadRentals = () => {
    setLoading(true);
    fetchRentals()
      .then((data) => {
        console.log("Rentals loaded:", data);
        setRentals(data);
      })
      .catch((err) => {
        console.error("Error fetching rentals:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // Get user_id from token
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.user_id);
        console.log("Logged in as user_id:", payload.user_id);
      } catch (err) {
        console.error("Failed to parse token:", err);
      }
    }

    loadRentals();
  }, []);

  // Filter rentals for current user only
  // TODO: Backend should have endpoint for user-specific rentals
  const myRentals = userId ? rentals.filter(r => r.user_id === userId) : [];
  
  // Show all rentals for now (for testing)
  const displayRentals = rentals;
  
  // Find active rental (no end_time)
  const activeRide = displayRentals.find(r => !r.end_time);
  // Get completed rentals
  const completedRentals = displayRentals.filter(r => r.end_time);

  const handleEndRide = async () => {
    if (!activeRide) return;
    try {
      await endRental(activeRide.rental_id, activeRide.user_id, activeRide.scooter_id);
      loadRentals();
    } catch (err) {
      console.error("Failed to end ride:", err);
      alert("Kunde inte avsluta resan");
    }
  };

  return (
    <div className="page-container home-centered">
      {/* Välkomstmeddelande */}
      <div className="card home-card">
        <h1 className="page-title home-title">
          Välkommen!
        </h1>
        <p className="home-info">
          Här kan du enkelt hyra en el-scooter, se din historik och hantera betalningar.
        </p>
      </div>

      {/* Aktiv uthyrning */}
      <div className="card home-card">
        <div className="section-title home-section-title">
          <MdOutlineElectricScooter /> Aktiv uthyrning
        </div>
        {activeRide ? (
          <div>
            <p><strong>Ride #{activeRide.rental_id}</strong></p>
            <p>Scooter: #{activeRide.scooter_id}</p>
            <p>Startad: {new Date(activeRide.start_time).toLocaleString('sv-SE')}</p>
            <button className="btn-primary home-action-btn" style={{ marginTop: 8 }} onClick={handleEndRide}>
              Avsluta resa
            </button>
          </div>
        ) : (
          <p className="home-muted">Ingen aktiv ride just nu.</p>
        )}
      </div>

      {/* Rent bike & Betalningar */}
      <div className="card home-card home-actions">
        <button className="btn-primary home-action-btn" onClick={() => navigate("/maps?filter=available")}><MdOutlineElectricScooter /> Hyr scooter</button>
        <button className="btn-outline home-action-btn" onClick={() => navigate("/payments")}><MdAttachMoney /> Betalningar</button>
      </div>

      {/* Historik */}
      <div className="card home-card">
        <div className="section-title home-section-title">
          <TfiAlarmClock /> Historik
        </div>
        {loading ? (
          <p className="home-muted">Laddar...</p>
        ) : completedRentals.length > 0 ? (
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {completedRentals.slice(0, 5).map((rental) => (
              <div key={rental.rental_id} style={{ 
                padding: "8px", 
                borderBottom: "1px solid #eee",
                fontSize: "0.9em"
              }}>
                <div><strong>Scooter:</strong> #{rental.scooter_id}</div>
                <div><strong>Start:</strong> {new Date(rental.start_time).toLocaleString('sv-SE')}</div>
                <div><strong>Slut:</strong> {new Date(rental.end_time).toLocaleString('sv-SE')}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="home-muted">Du har inga tidigare rides.</p>
        )}
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