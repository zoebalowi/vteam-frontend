const API_URL = process.env.REACT_APP_API_URL || "";

export async function getPrice() {
  const res = await fetch(`${API_URL}/v1/price`, {
    headers: { 'x-access-token': localStorage.getItem('token') }
  });
  if (!res.ok) throw new Error('Failed to fetch price');
  const data = await res.json();
  if (Array.isArray(data) && data.length > 0 && data[0].ppm !== undefined) {
    return { perMinute: data[0].ppm };
  }
  if (data && data.ppm !== undefined) {
    return { perMinute: data.ppm };
  }
  if (data && data.perMinute !== undefined) {
    return { perMinute: data.perMinute };
  }
  return { perMinute: 0.25 };
}

export async function updatePrice(data) {
  const res = await fetch(`${API_URL}/v1/price`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('token')
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update price');
  return res.json();
}
