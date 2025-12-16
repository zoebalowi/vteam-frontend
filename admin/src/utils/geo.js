// src/utils/geo.js
export function parseCoordinates(coordStr) {
  if (!coordStr) return null;
  const parts = coordStr.split(',').map(s => parseFloat(s.trim()));
  if (parts.length !== 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return null;
  const [a, b] = parts;
  // Heuristik: lat ska vara mellan -90 och 90
  if (Math.abs(a) <= 90 && Math.abs(b) <= 180) return { lat: a, lng: b };
  // Om omkastat
  if (Math.abs(b) <= 90 && Math.abs(a) <= 180) return { lat: b, lng: a };
  return null;
}