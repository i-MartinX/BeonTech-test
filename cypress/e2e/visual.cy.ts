import { CHECKOUT_INFO, URLS, USERS, VISUAL } from '../../shared/data';

const login = (user: { username: string; password: string }) => {
  cy.visit(URLS.ui);
  cy.get('[data-test="username"]').type(user.username);
  cy.get('[data-test="password"]').type(user.password);
  cy.get('[data-test="login-button"]').click();
};

// Cypress does not wait for images on its own, so a baseline could be taken half-loaded.
const imagesLoaded = () =>
  cy.get('img').should(($imgs) => {
    expect($imgs.length, 'page has images').to.be.greaterThan(0);
    $imgs.each((_, img) => {
      expect((img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0).to.be
        .true;
    });
  });

describe('Visual', () => {
  beforeEach(() => {
    cy.viewport(VISUAL.viewport.width, VISUAL.viewport.height);
  });

  it('[VIS-01] inventory page matches the baseline', () => {
    login(USERS.standard);
    cy.get('.inventory_item').should('have.length', 6);
    imagesLoaded();
    cy.matchSnapshot(VISUAL.snapshots['VIS-01']);
  });

  it('[VIS-02] login error state matches the baseline', () => {
    login(USERS.locked);
    cy.get('[data-test="error"]').should('be.visible');
    cy.matchSnapshot(VISUAL.snapshots['VIS-02']);
  });

  it('[VIS-03] order confirmation matches the baseline', () => {
    login(USERS.standard);
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="shopping-cart-link"]').click();
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type(CHECKOUT_INFO.firstName);
    cy.get('[data-test="lastName"]').type(CHECKOUT_INFO.lastName);
    cy.get('[data-test="postalCode"]').type(CHECKOUT_INFO.postalCode);
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="finish"]').click();
    cy.get('[data-test="complete-header"]').should('be.visible');
    imagesLoaded();
    cy.matchSnapshot(VISUAL.snapshots['VIS-03']);
  });
});
