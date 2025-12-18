import { parseCoordinates } from '../utils/geo';

// Use relative paths by default so the CRA dev server proxy (set in package.json) can forward requests
const defaultBase = "";
const baseFromEnv = process.env.REACT_APP_API_URL || defaultBase;
const base = baseFromEnv.replace(/\/$/, "");

const candidates = [
  `${base}/v1/bike`,
  `${base}/scooters`,
];

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

      // Accept a few common response shapes (array, {scooters: []}, {data: []}, {items: []})
      let items = [];
      if (Array.isArray(data)) items = data;
      else if (data && Array.isArray(data.scooters)) items = data.scooters;
      else if (data && Array.isArray(data.data)) items = data.data;
      else if (data && Array.isArray(data.items)) items = data.items;
      else {
        errors.push({ url, error: "Response did not contain an array of scooters" });
        continue;
      }

      // Normalize items: keep original coordinates string and parsed coords
      return items.map((s) => {
        // Accept several ways coordinates may come back from DB/API
        let rawCoords = s.coordinates ?? s.coords ?? s.location ?? "";

        // If coordinates stored as array [lat, lon]
        if (!rawCoords && Array.isArray(s.coordinates) && s.coordinates.length >= 2) {
          rawCoords = `${s.coordinates[0]},${s.coordinates[1]}`;
        }

        // If coordinates provided as separate fields (lat/lng, latitude/longitude, x/y etc.)
        if (!rawCoords) {
          const lat = s.lat ?? s.latitude ?? s.latitude_deg ?? s.y ?? null;
          const lng = s.lng ?? s.longitude ?? s.lon ?? s.longitude_deg ?? s.x ?? null;
          if (lat != null && lng != null) rawCoords = `${lat},${lng}`;
        }

        // Clean up possible surrounding quotes/parentheses and whitespace
        if (typeof rawCoords === 'string') {
          rawCoords = rawCoords.trim().replace(/^\(|\)$/g, '').replace(/^["']|["']$/g, '').trim();
        }

        const idVal = s.id ?? s.scooter_id ?? s.scooterId ?? null;
        const available = typeof s.available === 'number' ? Boolean(Number(s.available)) : Boolean(s.available);
        const rented = typeof s.rented === 'number' ? Boolean(Number(s.rented)) : Boolean(s.rented);

        return {
          id: idVal != null ? Number(idVal) : null,
          city_id: Number(s.city_id ?? s.cityId ?? null),
          available,
          rented,
          battery: Number(s.battery ?? s.charge ?? s.battery_level ?? 0),
          model: s.model ?? s.name ?? null,
          coordinates: rawCoords || null,
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

// Fetch a single scooter by id (tries v1 endpoints first)
export async function fetchScooter(id) {
  const candidates = [`${base}/v1/bike/${id}`, `${base}/scooters/${id}`];
  const errors = [];

  for (const url of candidates) {
    console.info(`[fetchScooter] trying ${url}`);
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) {
        errors.push({ url, status: res.status });
        continue;
      }

      const data = await res.json();
      let s = data.scooter ?? (Array.isArray(data.scooters) ? data.scooters[0] : data);
      if (Array.isArray(s)) s = s[0] ?? null;
      if (!s) {
        errors.push({ url, error: "No scooter in response" });
        continue;
      }

      const rawCoords = s.coordinates ?? s.coords ?? s.location ?? "";
      const idVal = s.id ?? s.scooter_id ?? s.scooterId ?? null;
      const available = typeof s.available === 'number' ? Boolean(Number(s.available)) : Boolean(s.available);
      const rented = typeof s.rented === 'number' ? Boolean(Number(s.rented)) : Boolean(s.rented);

      return {
        id: idVal != null ? Number(idVal) : null,
        city_id: Number(s.city_id ?? s.cityId ?? null),
        available,
        rented,
        battery: Number(s.battery ?? s.charge ?? s.battery_level ?? 0),
        model: s.model ?? s.name ?? null,
        coordinates: rawCoords,
        coords: parseCoordinates(rawCoords),
        ...s,
      };
    } catch (err) {
      errors.push({ url, message: err.message });
      continue;
    }
  }

  const msg = errors.map((e) => `${e.url} — ${e.status || e.error || e.message}`).join("; ");
  throw new Error(`Could not fetch scooter ${id}. Tried: ${msg}`);
}

// Fetch available scooters (tries v1 endpoint first)
export async function fetchAvailableScooters() {
  const candidates = [`${base}/v1/available/bike`, `${base}/scooters/available`];
  const errors = [];

  for (const url of candidates) {
    console.info(`[fetchAvailableScooters] trying ${url}`);
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) {
        errors.push({ url, status: res.status });
        continue;
      }

      const data = await res.json();
      const items = data.available ?? data.scooters ?? data;
      if (!Array.isArray(items)) {
        errors.push({ url, error: "Response did not contain an array" });
        continue;
      }

      return items.map((s) => {
        const rawCoords = s.coordinates ?? s.coords ?? s.location ?? "";
        const idVal = s.id ?? s.scooter_id ?? s.scooterId ?? null;
        const available = typeof s.available === 'number' ? Boolean(Number(s.available)) : Boolean(s.available);
        const rented = typeof s.rented === 'number' ? Boolean(Number(s.rented)) : Boolean(s.rented);

        return {
          id: idVal != null ? Number(idVal) : null,
          city_id: Number(s.city_id ?? s.cityId ?? null),
          available,
          rented,
          battery: Number(s.battery ?? s.charge ?? s.battery_level ?? 0),
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
  throw new Error(`Could not fetch available scooters. Tried: ${msg}`);
}

export async function fetchStations() {
  const candidates = [`${base}/v1/station`, `${base}/v1/stations`, `${base}/stations`];
  const errors = [];

  for (const url of candidates) {
    console.info(`[fetchStations] trying ${url}`);
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) {
        errors.push({ url, status: res.status });
        continue;
      }

      const data = await res.json();
      let arr = data;
      if (data && Array.isArray(data.stations)) arr = data.stations;
      if (!Array.isArray(arr)) {
        errors.push({ url, error: "Response did not contain an array of stations" });
        continue;
      }

      return arr.map(s => ({
        id: Number(s.id),
        city_id: Number(s.city_id ?? s.cityId ?? null),
        name: s.name || s.namn || '',
        capacity: Number(s.capacity || s.slots || 0),
        coords: parseCoordinates(s.coordinates)
      }));
    } catch (err) {
      errors.push({ url, message: err.message });
      continue;
    }
  }

  const msg = errors.map((e) => `${e.url} — ${e.status || e.error || e.message}`).join("; ");
  throw new Error(`Could not fetch stations. Tried: ${msg}`);
}
