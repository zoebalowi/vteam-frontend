// Enkla funktioner för autenticering
// Använd REACT_APP_API_URL om den finns, annars relativ URL så proxy funkar

const API_URL = process.env.REACT_APP_API_URL || "";


export async function registerUser(email, password) {
  try {
    const url = API_URL ? `${API_URL}/v1/register` : `/v1/register`;
    const response = await fetch(url, {
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
    const url = API_URL ? `${API_URL}/v1/login` : `/v1/login`;
    const response = await fetch(url, {
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
