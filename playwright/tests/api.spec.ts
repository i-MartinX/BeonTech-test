import { test, expect, APIRequestContext } from '@playwright/test';
import { ADMIN, URLS, newBooking } from '../../shared/data';

const api = URLS.api;

async function createBooking(request: APIRequestContext) {
  const res = await request.post(`${api}/booking`, { data: newBooking() });
  return (await res.json()).bookingid as number;
}

async function getToken(request: APIRequestContext) {
  const res = await request.post(`${api}/auth`, { data: ADMIN });
  return (await res.json()).token as string;
}

test.describe('API', () => {
  test('[API-01] health check returns 201 Created', async ({ request }) => {
    const res = await request.get(`${api}/ping`);
    expect(res.status()).toBe(201);
  });

  test('[API-02] create booking echoes the payload', async ({ request }) => {
    const payload = newBooking();
    const res = await request.post(`${api}/booking`, { data: payload });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.bookingid).toBeGreaterThan(0);
    expect(body.booking).toMatchObject(payload);
  });

  test('[API-03] get booking by id returns the stored data', async ({ request }) => {
    const id = await createBooking(request);
    const res = await request.get(`${api}/booking/${id}`);
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject(newBooking());
  });

  test('[API-04] get booking matches the expected schema', async ({ request }) => {
    const id = await createBooking(request);
    const body = await (await request.get(`${api}/booking/${id}`)).json();
    expect(body).toEqual({
      firstname: expect.any(String),
      lastname: expect.any(String),
      totalprice: expect.any(Number),
      depositpaid: expect.any(Boolean),
      bookingdates: { checkin: expect.any(String), checkout: expect.any(String) },
      additionalneeds: expect.any(String),
    });
  });

  test('[API-05] update booking with a valid token', async ({ request }) => {
    const id = await createBooking(request);
    const token = await getToken(request);
    const updated = { ...newBooking(), firstname: 'Grace', totalprice: 999 };
    const res = await request.put(`${api}/booking/${id}`, {
      data: updated,
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ firstname: 'Grace', totalprice: 999 });
  });

  test('[API-06] delete booking then it is gone', async ({ request }) => {
    const id = await createBooking(request);
    const token = await getToken(request);
    const del = await request.delete(`${api}/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(del.status()).toBe(201);
    const after = await request.get(`${api}/booking/${id}`);
    expect(after.status()).toBe(404);
  });

  test('[API-07] auth with bad credentials returns no token', async ({ request }) => {
    const res = await request.post(`${api}/auth`, {
      data: { username: 'admin', password: 'not-the-password' },
    });
    const body = await res.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });
});
