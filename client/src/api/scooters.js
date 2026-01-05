export async function fetchScooters() {
  try {
    const response = await fetch("/v1/bike");
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