// Use relative paths by default so the CRA dev server proxy (set in package.json) can forward requests
const defaultBase = "";
const baseFromEnv = process.env.REACT_APP_API_URL || defaultBase;
const base = baseFromEnv.replace(/\/$/, "");

function normalizeUser(u) {
  const email = u.email ?? "";
  const local = email.split("@")[0] ?? "";
  const displayName = local.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const name = u.name ?? displayName ?? `User ${u.id}`;
  return {
    id: u.id,
    email,
    name,
    hashed_password: u.hashed_password ?? u.password ?? null,
    ...u,
  };
}

export async function fetchUsers() {
  const candidates = [
    `${base}/v1/users`,
    `${base}/users`,
    `${base}/api/users`,
    `${base}/db/users`,
    `${base}/users.json`,
    `${base}/db.json`,
    `${base}/`,
  ];

  const errors = [];

  for (const url of candidates) {
    console.info(`[fetchUsers] trying ${url}`);
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

      if (!Array.isArray(data)) {
        if (data && typeof data === "object" && Array.isArray(data.users)) data = data.users;
        else {
          const arr = Object.values(data).find((v) => Array.isArray(v));
          if (arr) data = arr;
        }
      }

      if (!Array.isArray(data)) {
        errors.push({ url, error: "Response did not contain an array" });
        continue;
      }

      return data.map(normalizeUser);
    } catch (err) {
      errors.push({ url, message: err.message });
      continue;
    }
  }

  const msg = errors.map((e) => `${e.url} — ${e.status || e.error || e.message}`).join("; ");
  throw new Error(`Could not fetch users. Tried: ${msg}`);
}

export async function fetchUser(id) {
  const candidates = [`${base}/v1/users/${id}`, `${base}/users/${id}`];
  const errors = [];

  for (const url of candidates) {
    console.info(`[fetchUser] trying ${url}`);
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) {
        errors.push({ url, status: res.status });
        continue;
      }

      const data = await res.json();
      let u = data.user ?? data;
      if (Array.isArray(u)) u = u[0] ?? null;
      if (!u) {
        errors.push({ url, error: "No user in response" });
        continue;
      }

      return normalizeUser(u);
    } catch (err) {
      errors.push({ url, message: err.message });
      continue;
    }
  }

  const msg = errors.map((e) => `${e.url} — ${e.status || e.error || e.message}`).join("; ");
  throw new Error(`Could not fetch user ${id}. Tried: ${msg}`);
}