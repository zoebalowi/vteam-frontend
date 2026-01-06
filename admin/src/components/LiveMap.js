import React, { useState, useEffect } from "react";
import Map from "./Map";
import { fetchScooters } from "../api/scooters";
import { fetchStations } from "../api/stations";
import { fetchCities } from "../api/city";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";

function createMarkers(stations, scooters) {
	return [
		...stations.filter(s => s.lat != null && s.lon != null).map(s => ({
			position: [s.lat, s.lon],
			popup: s.name,
			type: 'station'
		})),
		       ...scooters.filter(s => s.lat != null && s.lon != null).map(s => ({
			       position: [s.lat, s.lon],
			       popup: `ID: ${s.id} | Batteri: ${s.battery ?? ''}%`,
			       type: 'scooter',
			       available: s.available,
			       rented: s.rented
		       }))
	];
}

export default function LiveMap() {
	const [cities, setCities] = useState([]);
	const [selectedCity, setSelectedCity] = useState("");
	const [mapCenter, setMapCenter] = useState([59.3293, 18.0686]);
	const [mapZoom, setMapZoom] = useState(12);
	const [scooters, setScooters] = useState([]);
	const [stations, setStations] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCities().then((data) => {
			setCities(data);
			if (data.length > 0) {
				setSelectedCity(data[0].name);
			}
		});
	}, []);

	useEffect(() => {
		let mounted = true;
		Promise.all([fetchScooters(), fetchStations()])
			.then(([scootersData, stationsData]) => {
				if (!mounted) return;
				setScooters(Array.isArray(scootersData) ? scootersData : []);
				setStations(Array.isArray(stationsData) ? stationsData : []);
			})
			.finally(() => {
				if (mounted) setLoading(false);
			});
		return () => (mounted = false);
	}, []);

	useEffect(() => {
		const cityObj = cities.find(c => c.name === selectedCity);
		if (cityObj && typeof cityObj.zone === 'string') {
			const [lat, lng] = cityObj.zone.split(',').map(Number);
			if (!isNaN(lat) && !isNaN(lng)) {
				setMapCenter([lat, lng]);
				setMapZoom(12);
			}
		}
	}, [selectedCity, cities]);

	if (loading) {
		return (
			<div className="loader-container">
				<div className="spinner"></div>
				<p className="loader-text">Laddar karta...</p>
			</div>
		);
	}

	const markers = createMarkers(stations, scooters);

	const markersWithKey = markers.map((m, i) => ({
		...m,
		key: m.type + '-' + (m.id ?? i) + '-' + m.position.join(',')
	}));


	return (
		<div className="page-container">
			<h1 className="page-title">Live Map</h1>
			<div style={{ marginBottom: 16 }}>
				<label htmlFor="city-select">Välj stad: </label>
				<select
					id="city-select"
					value={selectedCity}
					onChange={e => setSelectedCity(e.target.value)}
				>
					{cities.map(city => (
						<option key={city.id} value={city.name}>{city.name}</option>
					))}
				</select>
			</div>
			<div className="card map-card">
				<Map center={mapCenter} zoom={mapZoom} markers={markersWithKey} />
			</div>
		</div>
	);
}
