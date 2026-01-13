import React, { useState, useEffect } from "react";
import Map from "./Map";
import { fetchScooters } from "../api/scooters";
import { fetchStations } from "../api/stations";
import { fetchCities } from "../api/city";
import { startSim, stopSim, resetSim } from "../api/sim";
import "../styles/dashboard.css";
import "../styles/page.css";
import "../styles/widgets.css";
import "../styles/simulation.css";

function createMarkers(stations, scooters) {
	return [
		...stations.filter(s => s.lat != null && s.lon != null).map(s => ({
			position: [s.lat, s.lon],
			popup: s.name,
			type: 'station'
		})),
			       ...scooters.filter(s => s.lat != null && s.lon != null).map(s => ({
				       position: [s.lat, s.lon],
				       popup: `ID: ${s.scooter_id ?? s.id} | Batteri: ${s.battery ?? ''}%`,
				       type: 'scooter',
				       available: s.available,
				       rented: s.rented,
				       battery: s.battery,
				       id: s.scooter_id ?? s.id
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
	const [simStatus, setSimStatus] = useState("");
	const [simRunning, setSimRunning] = useState(false);
	const [simAmount, setSimAmount] = useState(10);
	const pollingRef = React.useRef(null);

	const startSimulation = async (amount) => {
			try {
				const data = await startSim(amount);
				setSimStatus(data);
				setSimRunning(true);
			} catch (error) {
				setSimStatus("Fel vid start av simulering");
			}
	};

	const stopSimulation = async () => {
			try {
				const data = await stopSim();
				setSimStatus(data);
				setSimRunning(false);
			} catch (error) {
				setSimStatus("Fel vid stopp av simulering");
			}
	};

	const resetSimulation = async () => {
			try {
				const data = await resetSim();
				setSimStatus(data);
				setSimRunning(false);
				const [scootersData, stationsData] = await Promise.all([
					fetchScooters(),
					fetchStations()
				]);
				setScooters(Array.isArray(scootersData) ? scootersData : []);
				setStations(Array.isArray(stationsData) ? stationsData : []);
			} catch (error) {
				setSimStatus("Fel vid reset av simulering");
			}
	};

	useEffect(() => {
		fetchCities().then((data) => {
			setCities(data);
			setSelectedCity(prev =>
			prev || (data.length > 0 ? data[0].name : "")
			);
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
		if (simRunning) {
			pollingRef.current = setInterval(() => {
				Promise.all([fetchScooters(), fetchStations()])
					.then(([scootersData, stationsData]) => {
						setScooters(Array.isArray(scootersData) ? scootersData : []);
						setStations(Array.isArray(stationsData) ? stationsData : []);
					});
			}, 3000);
		} else {
			if (pollingRef.current) {
				clearInterval(pollingRef.current);
				pollingRef.current = null;
			}
		}
		return () => {
			if (pollingRef.current) {
				clearInterval(pollingRef.current);
				pollingRef.current = null;
			}
		};
	}, [simRunning]);

	useEffect(() => {
		const cityObj = cities.find(c => c.name === selectedCity);
		if (cityObj) {
			const lat = Number(cityObj.lat);
			const lon = Number(cityObj.lon);
			if (!isNaN(lat) && !isNaN(lon)) {
				setMapCenter([lat, lon]);
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
			<div className="city-select-container">
				<label htmlFor="city-select" className="city-select-label">Välj stad:</label>
				<select
					id="city-select"
					value={selectedCity}
					onChange={e => setSelectedCity(e.target.value)}
					className="city-select-dropdown"
				>
					{cities.map(city => (
						<option key={city.name} value={city.name}>
							{city.name}
						</option>
					))}
				</select>
			</div>

			<div className="card map-card">
				<Map center={mapCenter} zoom={mapZoom} markers={markersWithKey} style={{ height: '600px' }} />
			</div>

			<div className="sim-controls-container">
				<div className="sim-controls-row sim-controls-row-flex">
					<div className="sim-controls-left">
						<label htmlFor="sim-amount" className="sim-controls-label">Antal cyklar:</label>
						<input
							id="sim-amount"
							type="number"
							min={1}
							value={simAmount}
							onChange={e => setSimAmount(Number(e.target.value))}
							className="sim-controls-input"
						/>
						<button
							onClick={() => startSimulation(simAmount)}
							className="sim-btn start"
						>
							Starta simulering
						</button>
						<button
							onClick={stopSimulation}
							className="sim-btn stop"
						>
							Stoppa simulering
						</button>
						<button
							onClick={resetSimulation}
							className="sim-btn reset"
						>
							Återställ simulering
						</button>
					</div>
					{simStatus && (
						<div className="sim-status-box sim-status-box-inline">
							{typeof simStatus === 'string' ? simStatus : JSON.stringify(simStatus)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
