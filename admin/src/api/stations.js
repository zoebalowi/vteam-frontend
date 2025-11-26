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
  const candidates = [
    `${base}/stations`,
    `${base}/api/stations`,
    `${base}/db/stations`,
    `${base}/stations.json`,
    `${base}/db.json`,
  ];

  const errors = [];

  for (const url of candidates) {
    console.info(`[fetchStations] trying ${url}`);
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

      let data = JSON.parse(text);

      // If root object, pick the stations array or the first array
      if (!Array.isArray(data)) {
        if (data && typeof data === "object" && Array.isArray(data.stations)) data = data.stations;
        else {
          const arr = Object.values(data).find((v) => Array.isArray(v));
          if (arr) data = arr;
        }
      }

      if (!Array.isArray(data)) {
        errors.push({ url, error: "No array found in response" });
        continue;
      }

      return data.map(normalizeStation);
    } catch (err) {
      errors.push({ url, message: err.message });
      continue;
    }
  }

  const msg = errors.map((e) => `${e.url} — ${e.status || e.error || e.message}`).join("; ");
  throw new Error(`Could not fetch stations. Tried: ${msg}`);
}