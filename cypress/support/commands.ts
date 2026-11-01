declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Screenshot the viewport and compare it with the stored baseline (see cypress.config.ts). */
      matchSnapshot(name: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('matchSnapshot', (name: string) => {
  // Unlike Playwright's toHaveScreenshot, cy.screenshot does not wait for the page to settle. A web font
  // or image arriving late reflows the page (the footer moves), which shows up as a large pixel diff.
  cy.document().its('fonts.status').should('eq', 'loaded');
  // The app is a single-page app, so the scroll position survives navigation and depends on how far Cypress
  // scrolled to click the previous button. Fix it, or the same page screenshots differently run to run.
  cy.scrollTo(0, 0, { ensureScrollable: false });
  cy.window().then((win) => new Cypress.Promise((resolve) => win.requestAnimationFrame(() => resolve())));
  cy.screenshot(name, { capture: 'viewport', overwrite: true, disableTimersAndAnimations: true });
  cy.task('compareSnapshot', { name, spec: Cypress.spec.name }).then((result) => {
    const r = result as { status: string; diffRatio: number; message: string };
    expect(['match', 'created', 'updated'], r.message).to.include(r.status);
  });
});

export {};
