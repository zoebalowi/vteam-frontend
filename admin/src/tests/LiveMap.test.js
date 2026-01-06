jest.mock('react-leaflet');

// Mocka API-anrop
jest.mock('../api/scooters', () => ({ fetchScooters: () => Promise.resolve([]) }));
jest.mock('../api/stations', () => ({ fetchStations: () => Promise.resolve([]) }));
jest.mock('../api/city', () => ({ fetchCities: () => Promise.resolve([{ id: 1, name: 'Teststad', zone: '59.3293,18.0686' }]) }));

// Mocka useMap så att den har flyTo
import * as reactLeaflet from 'react-leaflet';
reactLeaflet.useMap = () => ({ flyTo: () => {} });

import { render, screen, waitFor } from '@testing-library/react';
import LiveMap from '../components/LiveMap';

describe('LiveMap', () => {
  it('renders live map title', async () => {
    render(<LiveMap />);
    await waitFor(() => expect(screen.getByText(/live map/i)).toBeInTheDocument());
  });
});