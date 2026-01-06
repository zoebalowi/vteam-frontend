import "../styles/login.css";
import React, { useState } from "react";


export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRegisterSuccess("");
    try {
      if (registerMode) {
        const res = await fetch(process.env.REACT_APP_API_URL + "/v1/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
          let backendMsg = "";
          try {
            const errData = await res.json();
            backendMsg = typeof errData === "string" ? errData : (errData.message || JSON.stringify(errData));
          } catch {
            backendMsg = res.statusText;
          }
          setError(`Fel (${res.status}): ${backendMsg}`);
          setLoading(false);
          return;
        }
        setRegisterSuccess("Konto skapat! Du kan nu logga in.");
        setRegisterMode(false);
        setEmail("");
        setPassword("");
        setLoading(false);
        return;
      }
      // Logga in
      const res = await fetch(process.env.REACT_APP_API_URL + "/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        let backendMsg = "";
        try {
          const errData = await res.json();
          backendMsg = typeof errData === "string" ? errData : (errData.message || JSON.stringify(errData));
        } catch {
          backendMsg = res.statusText;
        }
        setError(`Fel (${res.status}): ${backendMsg}`);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!data.token) {
        setError("Ingen token mottagen från servern.");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      onLogin();
    } catch (e) {
      setError("Nätverksfel eller okänt fel: " + (e.message || e.toString()));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{registerMode ? "Skapa konto" : "Logga in"}</h2>
        <input
          type="email"
          placeholder="E-postadress"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {registerMode ? "Skapa konto" : "Logga in"}
        </button>
        <button
          type="button"
          className="btn-outline"
          style={{ marginTop: 4 }}
          onClick={() => {
            setRegisterMode(!registerMode);
            setError("");
            setRegisterSuccess("");
          }}
          disabled={loading}
        >
          {registerMode ? "Tillbaka till inloggning" : "Skapa nytt konto"}
        </button>
        {error && <div className="login-error">{error}</div>}
        {registerSuccess && <div className="login-success">{registerSuccess}</div>}
      </form>
    </div>
  );
}
