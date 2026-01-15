const API_URL = process.env.REACT_APP_API_URL || "";

export async function fetchRentals() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/v1/rental/me`, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token || ""
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.rentals || [];
  } catch (error) {
    console.error("Failed to fetch rentals:", error);
    return [];
  }
}

export async function startRental(userId, scooterId) {
  try {
    const token = localStorage.getItem("token");
    const rentalId = Date.now(); // Simple ID generation
    const response = await fetch(`${API_URL}/v1/rental/start/${rentalId}/${userId}/${scooterId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token || ""
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to start rental:", error);
    throw error;
  }
}

export async function endRental(rentalId, userId, scooterId) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/v1/rental/end/${rentalId}/${userId}/${scooterId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token || ""
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to end rental:", error);
    throw error;
  }
}
