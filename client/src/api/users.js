const API_URL = process.env.REACT_APP_API_URL || "";

export async function fetchUserById(userId) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/v1/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token || ""
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // backend returns { user: [ { ... } ] }
    return Array.isArray(data.user) ? data.user[0] : null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}
