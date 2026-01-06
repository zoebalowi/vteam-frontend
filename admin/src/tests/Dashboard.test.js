jest.mock('react-router-dom');
import { render, screen } from '@testing-library/react';
import DashboardPage from '../components/Dashboard';

describe('DashboardPage', () => {
  it('renders dashboard title', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});