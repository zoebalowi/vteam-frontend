const API_URL = process.env.REACT_APP_API_URL || "";

export async function fetchScooters() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/v1/bike`, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token || ""
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.scooters; 
  } catch (error) {
    console.error("Failed to fetch scooters:", error);
    return [];
  }
}