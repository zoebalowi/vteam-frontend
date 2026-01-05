import React, { useState, useEffect } from "react";
import Map from "./Map";
import { fetchScooters } from "../api/scooters";
import { fetchStations } from "../api/stations";
import { fetchCities } from "../api/city";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";

export default function LiveMap() {
	const [cities, setCities] = useState([]);
	const [selectedCity, setSelectedCity] = useState("");
	const [mapCenter, setMapCenter] = useState([59.3293, 18.0686]);
	const [mapZoom, setMapZoom] = useState(12);
	useEffect(() => {
		fetchCities().then((data) => {
			setCities(data);
			if (data.length > 0) {
				setSelectedCity(data[0].name);
			}
		});
	}, []);
	const [markers, setMarkers] = useState([]);
	useEffect(() => {
		if (!selectedCity || cities.length === 0) return;
		const cityObj = cities.find(c => c.name === selectedCity);
		let cityLat = 55.6050, cityLng = 13.0038;
		if (cityObj && typeof cityObj.zone === 'string') {
			const [lat, lng] = cityObj.zone.split(',').map(Number);
			cityLat = isNaN(lat) ? 55.6050 : lat;
			cityLng = isNaN(lng) ? 13.0038 : lng;
			setMapCenter([cityLat, cityLng]);
			setMapZoom(12);
		}
		let mounted = true;
		async function fetchData() {
			const [scooters, stations] = await Promise.all([
				fetchScooters(),
				fetchStations()
			]);
			const cityStations = stations.filter(s => {
				return (s.name || '').toLowerCase().includes(selectedCity.toLowerCase());
			});
			const cityScooters = scooters.filter(s => {
				return typeof s.city_name === 'string' && s.city_name.toLowerCase().includes(selectedCity.toLowerCase());
			});
			const stationMarkers = cityStations.filter(s => s.coords || s.coordinates).map(s => ({
				position: s.coords ? [s.coords.lat, s.coords.lng] : (Array.isArray(s.coordinates) ? s.coordinates : [cityLat, cityLng]),
				popup: s.name,
				type: 'station'
			}));
			const scooterMarkers = cityScooters.filter(s => s.coords || s.coordinates).map(s => ({
				position: s.coords ? [s.coords.lat, s.coords.lng] : (Array.isArray(s.coordinates) ? s.coordinates : [cityLat, cityLng]),
				popup: `Battery: ${s.battery ?? ''}%`,
				type: 'scooter',
				available: s.available
			}));
			if (mounted) setMarkers([...stationMarkers, ...scooterMarkers]);
		}
		fetchData();
		return () => { mounted = false; };
	}, [selectedCity, cities]);
	useEffect(() => {
		let socket;
		let interval;
		interval = setInterval(() => {
			const cityObj = cities.find(c => c.name === selectedCity);
			let cityLat = 55.6050, cityLng = 13.0038;
			if (cityObj && typeof cityObj.zone === 'string') {
				const [lat, lng] = cityObj.zone.split(',').map(Number);
				cityLat = isNaN(lat) ? 55.6050 : lat;
				cityLng = isNaN(lng) ? 13.0038 : lng;
				setMapCenter([cityLat, cityLng]);
				setMapZoom(12);
			}
			fetchScooters().then(scooters => {
				fetchStations().then(stations => {
					const cityStations = stations.filter(s => {
						return (s.name || '').toLowerCase().includes(selectedCity.toLowerCase());
					});
					const cityScooters = scooters.filter(s => {
						return typeof s.city_name === 'string' && s.city_name.toLowerCase().includes(selectedCity.toLowerCase());
					});
					const stationMarkers = cityStations.filter(s => s.coords || s.coordinates).map(s => ({
						position: s.coords ? [s.coords.lat, s.coords.lng] : (Array.isArray(s.coordinates) ? s.coordinates : [cityLat, cityLng]),
						popup: s.name,
						type: 'station'
					}));
					const scooterMarkers = cityScooters.filter(s => s.coords || s.coordinates).map(s => ({
						position: s.coords ? [s.coords.lat, s.coords.lng] : (Array.isArray(s.coordinates) ? s.coordinates : [cityLat, cityLng]),
						popup: `Battery: ${s.battery ?? ''}%`,
						type: 'scooter',
						available: s.available
					}));
					setMarkers([...stationMarkers, ...scooterMarkers]);
				});
			});
		}, 5000);
		return () => {
			if (socket) socket.close();
			clearInterval(interval);
		};
	}, [selectedCity, cities]);
	return (
		<div className="page-container">
			<h1 className="page-title">Live Map</h1>
			<div style={{ marginBottom: 16 }}>
				<label htmlFor="city-select" style={{ marginRight: 8 }}>Välj stad:</label>
				<select
					id="city-select"
					value={selectedCity}
					onChange={e => setSelectedCity(e.target.value)}
					style={{ padding: "6px 12px", fontSize: "1rem" }}
				>
					{cities.map(city => (
						<option key={city.id ?? city.name} value={city.name}>{city.name}</option>
					))}
				</select>
			</div>
			<div style={{ width: "100%", height: "600px", marginBottom: 24 }}>
				<Map center={mapCenter} zoom={mapZoom} markers={markers} style={{ height: "100%", width: "100%" }} />
			</div>
		</div>
	);
}
