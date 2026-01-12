import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../authUtils";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isRegister) {
        await registerUser(email, password);
        setSuccess("Registrering lyckad! Logga in nu.");
        setIsRegister(false);
        setPassword("");
      } else {
        await loginUser(email, password);
        // Force reload to update App.js token check
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.message || (isRegister ? "Registrering misslyckades" : "Login misslyckades"));
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isRegister ? "Registrera" : "Login"}</h1>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            {isRegister ? "Registrera" : "Logga in"}
          </button>
        </form>

        <p className="toggle-text">
          {isRegister ? "Har du redan konto?" : "Ingen konto?"}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setSuccess("");
            }}
            className="toggle-btn"
          >
            {isRegister ? "Logga in här" : "Registrera dig här"}
          </button>
        </p>

        <div className="divider">ELLER</div>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/v1/oauth-run";
          }}
          className="google-btn"
        >
          Logga in med Google
        </button>
      </div>
    </div>
  );
}
