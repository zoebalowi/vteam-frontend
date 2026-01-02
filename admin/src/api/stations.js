import { parseCoordinates } from '../utils/geo';

// Use relative paths by default so the CRA dev server proxy (set in package.json) can forward requests
const defaultBase = "";
const baseFromEnv = process.env.REACT_APP_API_URL || defaultBase;
const base = baseFromEnv.replace(/\/$/, "");

function normalizeStation(s) {
  return {
    id: s.id,
    name: s.namn ?? s.name ?? `Station ${s.id}`,
    capacity: Number(s.capacity ?? s.slots ?? 0),
    coordinates: s.coordinates ?? s.coords ?? s.location ?? "",
    city_id: s.city_id ?? s.cityId ?? null,
    ...s,
  };
}

export async function fetchStations() {
  const candidates = [`${base}/v1/stations`, `${base}/v1/station`, `${base}/stations`];
  const errors = [];

  for (const url of candidates) {
    console.info(`[fetchStations] trying ${url}`);
    try {
      const res = await fetch(url, { headers: { Accept: "application/json", 'x-access-token': localStorage.getItem('token') } });
      if (!res.ok) {
        errors.push({ url, status: res.status, statusText: res.statusText });
        continue;
      }

      const data = await res.json();
      let arr = data;
      if (data && Array.isArray(data.stations)) arr = data.stations;
      else if (data && Array.isArray(data.items)) arr = data.items;

      if (!Array.isArray(arr)) {
        errors.push({ url, error: "Response did not contain an array of stations" });
        continue;
      }

      return arr.map((s) => {
        const n = normalizeStation(s);
        const rawCoords = n.coordinates ?? "";
        return {
          id: Number(n.id),
          city_id: Number(n.city_id ?? n.cityId ?? null),
          name: n.name || n.namn || `Station ${n.id}`,
          capacity: Number(n.capacity ?? n.slots ?? 0),
          // Keep the original coordinates string (for display) and a parsed coords object (for mapping)
          coordinates: rawCoords,
          coords: parseCoordinates(rawCoords),
          ...n,
        };
      });
    } catch (err) {
      errors.push({ url, message: err.message });
      continue;
    }
  }

  const msg = errors.map((e) => `${e.url} — ${e.status || e.error || e.message}`).join("; ");
  throw new Error(`Could not fetch stations. Tried: ${msg}`);
}