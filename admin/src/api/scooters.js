import { parseCoordinates } from '../utils/geo';

const defaultBase = "http://localhost:1337";
const baseFromEnv = process.env.REACT_APP_API_URL || defaultBase;
const base = baseFromEnv.replace(/\/$/, "");

const candidates = [`${base}/scooters`];

export async function fetchScooters() {
  const errors = [];
  for (const url of candidates) {
    console.info(`[fetchScooters] trying ${url}`);
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      const text = await res.text();

      if (!res.ok) {
        errors.push({ url, status: res.status, statusText: res.statusText });
        continue;
      }

      if (text.trim().startsWith("<")) {
        errors.push({ url, error: "HTML returned (likely wrong host/port)" });
        continue;
      }

      const data = JSON.parse(text);

      // Accept a few common response shapes
      let items = [];
      if (Array.isArray(data)) items = data;
      else if (data && Array.isArray(data.data)) items = data.data;
      else if (data && Array.isArray(data.items)) items = data.items;
      else {
        errors.push({ url, error: "Response did not contain an array of scooters" });
        continue;
      }

      // Normalize items: keep original coordinates string and parsed coords
      return items.map((s) => {
        const rawCoords = s.coordinates ?? s.coords ?? s.location ?? "";
        return {
          id: Number(s.id),
          city_id: Number(s.city_id ?? s.cityId ?? null),
          available: Boolean(s.available),
          rented: Boolean(s.rented),
          battery: Number(s.battery ?? s.charge ?? 0),
          model: s.model ?? s.name ?? null,
          coordinates: rawCoords,
          coords: parseCoordinates(rawCoords),
          ...s,
        };
      });
    } catch (err) {
      errors.push({ url, message: err.message });
      continue;
    }
  }

  const msg = errors.map((e) => `${e.url} — ${e.status || e.error || e.message}`).join("; ");
  throw new Error(`Could not fetch scooters. Tried: ${msg}`);
}

export async function fetchStations() {
  const res = await fetch(`${base}/stations`);
  const arr = await res.json();
  return arr.map(s => ({
    id: Number(s.id),
    city_id: Number(s.city_id),
    name: s.name || s.namn || '',
    capacity: Number(s.capacity || 0),
    coords: parseCoordinates(s.coordinates)
  }));
}
