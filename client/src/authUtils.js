// Enkla funktioner för autenticering
// Använd relativ URL så proxy funkar

export async function registerUser(email, password) {
  try {
    const response = await fetch(`/v1/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (err) {
    console.error("Register error:", err);
    throw err;
  }
}

export async function loginUser(email, password) {
  try {
    const response = await fetch(`/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}
