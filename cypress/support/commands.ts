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
  cy.screenshot(name, { capture: 'viewport', overwrite: true, disableTimersAndAnimations: true });
  cy.task('compareSnapshot', { name, spec: Cypress.spec.name }).then((result) => {
    const r = result as { status: string; diffRatio: number; message: string };
    expect(['match', 'created', 'updated'], r.message).to.include(r.status);
  });
});

export {};
