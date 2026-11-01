describe('smoke', () => {
  it('SauceDemo login page loads', () => {
    cy.visit('https://www.saucedemo.com');
    cy.get('[data-test="login-button"]').should('be.visible');
  });

  it('Restful-Booker health check', () => {
    cy.request('https://restful-booker.herokuapp.com/ping').its('status').should('eq', 201);
  });
});
