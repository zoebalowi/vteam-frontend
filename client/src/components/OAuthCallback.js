import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Hämta token från URL (backend skickar det som query param)
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
          // Spara token i localStorage
          localStorage.setItem("token", token);
          // Hårdladda sidan så App läser token från localStorage
          window.location.href = "/";
        } else {
          // Ingen token, redirect till login
          navigate("/login");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p>Loggar in...</p>
    </div>
  );
}
