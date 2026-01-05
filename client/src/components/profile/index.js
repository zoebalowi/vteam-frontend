import React, { useEffect, useState } from "react";
import { logout } from "../../authUtils";
import "../../style/profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    // getMe() är inte implementerad än i backend
    // För nu bara hämta token som proof of login
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ email: "user@example.com" }); // Placeholder
    }
    setLoading(false);
    return () => (mounted = false);
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div className="page-container home-centered">
        <div className="card home-card">
          <h1 className="page-title home-title">Profil</h1>
          <p className="home-muted">Du är inte inloggad.</p>
        </div>
      </div>
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("Profiluppdatering är inte implementerad än");
    setSaving(false);
  }

  return (
    <div className="page-container home-centered">
      <div className="card home-card">
        <h1 className="page-title home-title">Min profil</h1>
        <div className="profile-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={user.avatar || `${process.env.PUBLIC_URL}/avatar-placeholder.png`} alt="avatar" className="avatar" />
          <form onSubmit={handleSave} className="profile-form" style={{ width: "100%", maxWidth: 350 }}>
            <label>
              Namn
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              E-post
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label>
              Telefon
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            {error && <p className="error home-muted">{error}</p>}
            <div className="home-actions" style={{ marginTop: 16 }}>
              <button type="submit" className="btn-primary home-action-btn" disabled={saving}>
                {saving ? "Sparar..." : "Spara"}
              </button>
              <button
                type="button"
                className="btn-outline home-action-btn"
                onClick={async () => {
                  await logout();
                  window.location.reload();
                }}
              >
                Logga ut
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}