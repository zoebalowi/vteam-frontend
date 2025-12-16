import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker icons (bundlers sometimes miss them)
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Small helper to create a simple SVG divIcon for custom pins
function createSvgIcon({ color = '#2b6cb0', symbol = '' } = {}) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 24 34" fill="none">
      <path d="M12 0C7.03 0 3 4.03 3 9c0 6.75 8.85 18.15 8.85 18.15.14.18.38.28.62.28s.48-.1.62-.28C12.15 27.15 21 15.75 21 9c0-4.97-4.03-9-9-9z" fill="${color}"/>
      <circle cx="12" cy="9" r="3" fill="#fff" />
      ${symbol}
    </svg>
  `;
  return L.divIcon({ html: svg, className: '', iconSize: [28, 36], iconAnchor: [14, 36] });
}

const stationIcon = createSvgIcon({ color: '#2b6cb0' }); // blue
const scooterIcon = createSvgIcon({ color: '#f59e0b' }); // amber
const scooterAvailableIcon = createSvgIcon({ color: '#10b981' }); // green

function getIconForMarker(m) {
  if (!m || !m.type) return undefined;
  if (m.type === 'station') return stationIcon;
  if (m.type === 'scooter') return m.available ? scooterAvailableIcon : scooterIcon;
  return undefined;
}

export default function Map({ center=[59.3293, 18.0686], zoom=13, markers=[] , style={ height: '400px' } }) {
  return (
    <MapContainer center={center} zoom={zoom} style={style}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((m, i) => {
        const icon = getIconForMarker(m);
        return (
          <Marker key={i} position={m.position} icon={icon}>
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        );
      })}
    </MapContainer>
  );
}

/*
Usage example (do fetching in a parent/container component such as `Dashboard`):

// const stations = await fetchStations();
// const stationMarkers = stations
//   .filter(s => s.coords)
//   .map(s => ({ position: [s.coords.lat, s.coords.lng], popup: s.name, type: 'station' }));

// const scooters = await fetchScooters();
// const scooterMarkers = scooters
//   .filter(s => s.coords)
//   .map(s => ({ position: [s.coords.lat, s.coords.lng], popup: `Battery: ${s.battery}`, type: 'scooter', available: s.available }));

// Then render: <Map markers={stationMarkers.concat(scooterMarkers)} />
*/