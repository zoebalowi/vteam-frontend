import { render } from '@testing-library/react';
import Profile from './index';

describe('Profile', () => {
  test('renders without crashing', () => {
    render(<Profile />);
  });
});
