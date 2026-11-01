import { ADMIN, URLS, newBooking } from '../../shared/data';

const api = URLS.api;

const createBooking = () =>
  cy.request('POST', `${api}/booking`, newBooking()).then((res) => res.body.bookingid as number);

const getToken = () =>
  cy.request('POST', `${api}/auth`, ADMIN).then((res) => res.body.token as string);

describe('API', () => {
  it('[API-01] health check returns 201 Created', () => {
    cy.request(`${api}/ping`).its('status').should('eq', 201);
  });

  it('[API-02] create booking echoes the payload', () => {
    const payload = newBooking();
    cy.request('POST', `${api}/booking`, payload).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.bookingid).to.be.greaterThan(0);
      expect(res.body.booking).to.deep.include(payload);
    });
  });

  it('[API-03] get booking by id returns the stored data', () => {
    createBooking().then((id) => {
      cy.request(`${api}/booking/${id}`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.deep.include(newBooking());
      });
    });
  });

  it('[API-04] get booking matches the expected schema', () => {
    createBooking().then((id) => {
      cy.request(`${api}/booking/${id}`).then(({ body }) => {
        expect(body).to.have.all.keys(
          'firstname',
          'lastname',
          'totalprice',
          'depositpaid',
          'bookingdates',
          'additionalneeds',
        );
        expect(body.firstname).to.be.a('string');
        expect(body.lastname).to.be.a('string');
        expect(body.totalprice).to.be.a('number');
        expect(body.depositpaid).to.be.a('boolean');
        expect(body.bookingdates).to.have.all.keys('checkin', 'checkout');
        expect(body.additionalneeds).to.be.a('string');
      });
    });
  });

  it('[API-05] update booking with a valid token', () => {
    createBooking().then((id) => {
      getToken().then((token) => {
        const updated = { ...newBooking(), firstname: 'Grace', totalprice: 999 };
        cy.request({
          method: 'PUT',
          url: `${api}/booking/${id}`,
          body: updated,
          headers: { Cookie: `token=${token}` },
        }).then((res) => {
          expect(res.status).to.eq(200);
          expect(res.body).to.deep.include({ firstname: 'Grace', totalprice: 999 });
        });
      });
    });
  });

  it('[API-06] delete booking then it is gone', () => {
    createBooking().then((id) => {
      getToken().then((token) => {
        cy.request({
          method: 'DELETE',
          url: `${api}/booking/${id}`,
          headers: { Cookie: `token=${token}` },
        })
          .its('status')
          .should('eq', 201);
        cy.request({ url: `${api}/booking/${id}`, failOnStatusCode: false })
          .its('status')
          .should('eq', 404);
      });
    });
  });

  it('[API-07] auth with bad credentials returns no token', () => {
    cy.request('POST', `${api}/auth`, { username: 'admin', password: 'not-the-password' }).then(
      ({ body }) => {
        expect(body).to.not.have.property('token');
        expect(body.reason).to.eq('Bad credentials');
      },
    );
  });
});
