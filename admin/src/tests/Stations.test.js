import { render, screen } from '@testing-library/react';
import StationsPage from '../components/Stations';

describe('StationsPage', () => {
  it('renders stations title', () => {
    render(<StationsPage />);
    expect(screen.getByText(/stations/i)).toBeInTheDocument();
  });
});