export async function fetchScooters() {
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";
  const base = baseUrl.replace(/\/$/, "");
  const candidates = [`${base}/scooters`, `${base}/api/scooters`, `${base}/db/scooters`];

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
      if (!Array.isArray(data)) {
        errors.push({ url, error: "Response was not an array" });
        continue;
      }
      return data;
    } catch (err) {
      errors.push({ url, message: err.message });
      continue;
    }
  }

  const msg = errors.map((e) => `${e.url} — ${e.status || e.error || e.message}`).join("; ");
  throw new Error(`Could not fetch scooters. Tried: ${msg}`);
}