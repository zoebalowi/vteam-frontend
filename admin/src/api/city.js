export async function fetchCities() {
  const token = localStorage.getItem("token");
  const res = await fetch("/v1/city", {
    headers: {
      "Accept": "application/json",
      "x-access-token": token
    }
  });
  const data = await res.json();
  // Return array of cities
  return Array.isArray(data.cities) ? data.cities : [];
}

export async function fetchCityById(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`/v1/city/${id}` , {
    headers: {
      "Accept": "application/json",
      "x-access-token": token
    }
  });
  const data = await res.json();
  // Return city object
  return data.city ? data.city[0] : null;
}

export async function fetchCityByName(name) {
  const token = localStorage.getItem("token");
  const res = await fetch(`/v1/city/name/${encodeURIComponent(name)}` , {
    headers: {
      "Accept": "application/json",
      "x-access-token": token
    }
  });
  const data = await res.json();
  // Return city object
  return data.user ? data.user[0] : null;
}
