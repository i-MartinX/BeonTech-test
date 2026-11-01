import { CHECKOUT_INFO, URLS, USERS } from '../../shared/data';

const login = (user: { username: string; password: string }) => {
  cy.visit(URLS.ui);
  cy.get('[data-test="username"]').type(user.username);
  cy.get('[data-test="password"]').type(user.password);
  cy.get('[data-test="login-button"]').click();
};

describe('UI', () => {
  it('[UI-01] standard user logs in and sees 6 products', () => {
    login(USERS.standard);
    cy.url().should('match', /inventory\.html/);
    cy.get('.inventory_item').should('have.length', 6);
  });

  it('[UI-02] locked-out user sees an error', () => {
    login(USERS.locked);
    cy.get('[data-test="error"]').should('contain.text', 'locked out');
  });

  it('[UI-03] invalid credentials show an error', () => {
    login(USERS.invalid);
    cy.get('[data-test="error"]').should('contain.text', 'Username and password do not match');
  });

  it('[UI-04] sort products by price low to high', () => {
    login(USERS.standard);
    cy.get('[data-test="product-sort-container"]').select('lohi');
    cy.get('[data-test="inventory-item-price"]').then(($els) => {
      const prices = [...$els].map((el) => parseFloat(el.innerText.replace('$', '')));
      expect(prices).to.deep.equal([...prices].sort((a, b) => a - b));
    });
  });

  it('[UI-05] adding to cart updates the badge', () => {
    login(USERS.standard);
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1');
  });

  it('[UI-06] complete checkout flow', () => {
    login(USERS.standard);
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type(CHECKOUT_INFO.firstName);
    cy.get('[data-test="lastName"]').type(CHECKOUT_INFO.lastName);
    cy.get('[data-test="postalCode"]').type(CHECKOUT_INFO.postalCode);
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="finish"]').click();
    cy.get('[data-test="complete-header"]').should('have.text', 'Thank you for your order!');
  });

  it('[UI-07] inventory still renders when product images fail', () => {
    cy.intercept('**/*.jpg', { forceNetworkError: true });
    login(USERS.standard);
    cy.get('.inventory_item').should('have.length', 6);
    cy.get('[data-test="inventory-item-name"]').first().should('be.visible');
  });
});
