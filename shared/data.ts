// Single source of truth for both suites, so Playwright and Cypress run identical scenarios.

export const URLS = {
  ui: 'https://www.saucedemo.com',
  api: 'https://restful-booker.herokuapp.com',
};

export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  invalid: { username: 'nobody', password: 'wrong_password' },
};

export const ADMIN = { username: 'admin', password: 'password123' };

export const CHECKOUT_INFO = { firstName: 'Ada', lastName: 'Lovelace', postalCode: '28001' };

/** Visual checks: same viewport in both tools, and one snapshot name per scenario. */
export const VISUAL = {
  viewport: { width: 1280, height: 720 },
  snapshots: {
    'VIS-01': 'inventory',
    'VIS-02': 'login-error',
    'VIS-03': 'order-complete',
  } as Record<string, string>,
};

export const newBooking = () => ({
  firstname: 'Ada',
  lastname: 'Lovelace',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
  additionalneeds: 'Breakfast',
});
