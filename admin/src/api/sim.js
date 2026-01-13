const API_URL = process.env.REACT_APP_API_URL || "";

export async function startSim(amount) {
    const response = await fetch(`${API_URL}/v1/startsim/${amount}`);
    return await response.json();
}

export async function stopSim() {
    const response = await fetch(`${API_URL}/v1/stopsim`);
    return await response.json();
}

export async function resetSim() {
    const response = await fetch(`${API_URL}/v1/resetsim`);
    return await response.json();
}
