import { render } from '@testing-library/react';
import Payments from './index';

describe('Payments', () => {
  test('renders without crashing', () => {
    render(<Payments />);
  });
});
