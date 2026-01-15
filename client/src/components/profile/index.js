import React, { useEffect, useState } from "react";
import { logout, getToken } from "../../authUtils";
import "../../style/profile.css";

const API_URL = process.env.REACT_APP_API_URL || "";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.user_id;

      fetch(`${API_URL}/v1/users/${userId}`, {
        headers: { "x-access-token": token }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user && data.user[0]) {
            setUser(data.user[0]);
          }
        })
        .catch((err) => console.error("Error fetching user:", err))
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Token parse error:", err);
      setLoading(false);
    }
  }, []);

  return (
    <div className="page-container home-centered">
      <h1 className="page-title">Min profil</h1>

      {loading ? (
        <div className="card home-card">
          <p className="home-muted">Laddar profil...</p>
        </div>
      ) : (
        <>
          <div className="card home-card">
            <div className="section-title home-section-title">E-post</div>
            <p style={{ fontSize: "1.1rem", color: "#333" }}>
              {user?.email ?? "Ingen e-post"}
            </p>
          </div>

          <div className="card home-card">
            <div className="section-title home-section-title">Saldo</div>
            <div style={{ 
              fontSize: "2.5rem", 
              fontWeight: "700", 
              color: "#2ecc71"
            }}>
              {Number(user?.balance ?? 0).toFixed(2)} kr
            </div>
          </div>

          <div className="card home-card">
            <button
              className="btn-outline home-action-btn"
              onClick={async () => {
                await logout();
                window.location.reload();
              }}
              style={{ width: "100%" }}
            >
              Logga ut
            </button>
          </div>
        </>
      )}
    </div>
  );
}