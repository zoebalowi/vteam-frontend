export async function getMe() {
  try {
    const res = await fetch("http://localhost:3001/v1/users", { credentials: "include" });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("getMe error", e);
    return null;
  }
}

export function loginWithProvider(provider = "google") {
  const backend = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
  window.location.href = `${backend}/v1/oauth-run`;
}

export async function logout() {
  try {
    // Backend har ingen logout endpoint - rensa frontend sessionen
    localStorage.clear();
    sessionStorage.clear();
    return true;
  } catch (e) {
    console.error("logout error", e);
    return false;
  }
}

export async function updateProfile(userId, data) {
  try {
    // Backend har ingen PUT/PATCH endpoint för users än - denna funktionalitet kan inte fungera
    console.warn("updateProfile: Backend saknar update endpoint för users");
    throw new Error("Update endpoint not available in backend");
  } catch (e) {
    console.error("updateProfile error", e);
    throw e;
  }
}