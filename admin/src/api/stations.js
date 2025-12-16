import { parseCoordinates } from '../utils/geo';

const defaultBase = "http://localhost:3000";
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
  const res = await fetch(`${base}/stations`);
  const arr = await res.json();
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
}