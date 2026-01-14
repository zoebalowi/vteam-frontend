import * as rentalsApi from './rentals';
import * as paymentsApi from './payments';
import * as usersApi from './users';

describe('APIs', () => {
  test('rentals api exists', () => {
    expect(typeof rentalsApi.fetchRentals).toBe('function');
    expect(typeof rentalsApi.endRental).toBe('function');
  });

  test('payments api exists', () => {
    expect(typeof paymentsApi.fetchPaymentHistory).toBe('function');
    expect(typeof paymentsApi.addBalance).toBe('function');
  });

  test('users api exists', () => {
    expect(typeof usersApi.fetchUserById).toBe('function');
  });
});
