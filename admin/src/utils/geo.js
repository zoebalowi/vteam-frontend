// src/utils/geo.js
export function parseCoordinates(coordStr) {
  if (!coordStr) return null;
  // Normalize common separators and strip quotes/parenthesis
  let s = String(coordStr).trim();
  s = s.replace(/^\(|\)$/g, ''); // remove surrounding parentheses
  s = s.replace(/^["'\s]+|["'\s]+$/g, ''); // trim quotes and extra whitespace
  s = s.replace(/;/g, ','); // allow semicolon as separator

  const parts = s.split(',').map((p) => parseFloat(p.trim()));
  if (parts.length !== 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return null;
  const [a, b] = parts;
  // Heuristik: lat ska vara mellan -90 och 90
  if (Math.abs(a) <= 90 && Math.abs(b) <= 180) return { lat: a, lng: b };
  // Om omkastat
  if (Math.abs(b) <= 90 && Math.abs(a) <= 180) return { lat: b, lng: a };
  return null;
}