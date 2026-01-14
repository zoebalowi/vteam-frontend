import { render } from '@testing-library/react';
import Login from './index';

describe('Login', () => {
  test('renders without crashing', () => {
    render(<Login />);
  });
});
