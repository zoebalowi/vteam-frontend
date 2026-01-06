import { render, screen } from '@testing-library/react';
import UsersPage from '../components/Users';

describe('UsersPage', () => {
  it('renders users title', () => {
    render(<UsersPage />);
    expect(screen.getByText(/users/i)).toBeInTheDocument();
  });
});