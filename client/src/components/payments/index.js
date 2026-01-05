import React from "react";

function Payments() {
  // Dummy data, byt ut mot riktig betalningsdata från backend
  const paymentHistory = [];
  const balance = 0;

  return (
    <div className="page-container home-centered">
      <div className="card home-card">
        <h1 className="page-title home-title">Betalningar</h1>
        <div className="section-title home-section-title">Saldo</div>
        <p className="home-info">{balance} kr</p>
        <button className="btn-primary home-action-btn" style={{ marginTop: 12 }}>Ladda saldo</button>
      </div>
      <div className="card home-card">
        <div className="section-title home-section-title">Betalningshistorik</div>
        {paymentHistory.length === 0 ? (
          <p className="home-muted">Ingen betalningshistorik.</p>
        ) : (
          <ul>
            {paymentHistory.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Payments;
