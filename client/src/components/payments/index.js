import React, { useEffect, useState } from "react";
import { fetchPaymentHistory, addBalance } from "../../api/payments";
import { fetchUserById } from "../../api/users";
import { getToken } from "../../authUtils";
import "../../style/home.css";
import { MdAttachMoney , MdReceiptLong } from "react-icons/md";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState(0);
  const [topUpStatus, setTopUpStatus] = useState("");

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.user_id);
        
        fetchUserById(payload.user_id).then((u) => setUser(u)).catch(() => {});

        fetchPaymentHistory(payload.user_id)
          .then((data) => {
            setPayments(data);
          })
          .catch((err) => {
            console.error("Error fetching payment history:", err);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (err) {
        console.error("Failed to parse token:", err);
        setLoading(false);
      }
    }
  }, []);

  const balance = user?.balance ?? 0;

  const handleTopUp = async () => {
    setTopUpStatus("");
    const amount = Number(topUpAmount);
    
    if (!amount || amount <= 0) {
      setTopUpStatus("Ange ett belopp större än 0");
      return;
    }
    
    try {
      await addBalance(userId, amount, "card");
      setTopUpStatus("✓ Saldo uppdaterat!");
      setTopUpAmount(0);
      
      const updatedUser = await fetchUserById(userId);
      setUser(updatedUser);
      
      const updatedPayments = await fetchPaymentHistory(userId);
      setPayments(updatedPayments);
    } catch (err) {
      console.error("Top-up failed:", err);
      setTopUpStatus("✗ Misslyckades att uppdatera saldo");
    }
  };

  return (
    <div className="page-container home-centered">
      <h1 className="page-title"><MdAttachMoney /> Betalningar</h1>
      
      {/* Saldo-kort */}
      <div className="card home-card">
        <div className="section-title home-section-title"> Nuvarande saldo</div>
        <div style={{ 
          fontSize: "2.5rem", 
          fontWeight: "700", 
          color: "#2ecc71",
          marginBottom: "1.5rem"
        }}>
          {Number(balance).toFixed(2)} kr
        </div>

        <div className="section-title" style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
          Ladda saldo
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="number"
            min={1}
            step={10}
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            placeholder="Belopp (kr)"
            style={{ 
              padding: "10px 16px", 
              width: "160px",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              fontSize: "1rem"
            }}
          />
          <button 
            className="btn-primary home-action-btn" 
            onClick={handleTopUp}
            style={{
              padding: "10px 24px",
              borderRadius: "6px",
              border: "none",
              background: "#3498db",
              color: "white",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
             Ladda saldo
          </button>
        </div>
        {topUpStatus && (
          <div style={{ 
            marginTop: 16, 
            padding: "12px",
            borderRadius: "6px",
            background: topUpStatus.includes('✓') ? '#d4edda' : '#f8d7da',
            color: topUpStatus.includes('✓') ? '#155724' : '#721c24',
            fontWeight: "500"
          }}>
            {topUpStatus}
          </div>
        )}
      </div>

      {/* Betalningshistorik */}
      <div className="card home-card">
        <div className="section-title home-section-title"><MdReceiptLong /> Betalningshistorik</div>
        {loading ? (
          <p className="home-muted" style={{ textAlign: "center", padding: "2rem" }}>⏳ Laddar...</p>
        ) : payments.length === 0 ? (
          <p className="home-muted" style={{ textAlign: "center", padding: "2rem" }}>📭 Ingen betalningshistorik än</p>
        ) : (
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {payments.map((payment, index) => (
              <div 
                key={payment.payment_id} 
                style={{ 
                  padding: "16px", 
                  borderBottom: index < payments.length - 1 ? "1px solid #e0e0e0" : "none",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "12px",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{ fontWeight: "600", fontSize: "1rem", marginBottom: "4px" }}>
                    Betalning #{payment.payment_id}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#666", lineHeight: "1.5" }}>
                    <div>🛴 Hyra: #{payment.rental_id}</div>
                    <div>💳 Metod: {payment.pay_method || 'Saldo'}</div>
                    <div>✓ Status: {payment.status || 'Genomförd'}</div>
                  </div>
                </div>
                <div style={{ 
                  fontSize: "1.25rem", 
                  fontWeight: "700",
                  color: "#e74c3c",
                  display: "flex",
                  alignItems: "center"
                }}>
                  -{Number(payment.amount).toFixed(2)} kr
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Payments;
