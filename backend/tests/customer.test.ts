import request from 'supertest';
import { app, ensureTestData, loginAs, uniqueEmail, closeDb } from './helpers';

let adminToken = '';
let userToken = '';

beforeAll(async () => {
  await ensureTestData();
  adminToken = await loginAs('admin@example.com', 'Admin@123');
  userToken = await loginAs('user@example.com', 'User@123');
});

afterAll(async () => {
  await closeDb();
});

const validCustomer = () => ({
  firstName: 'Test',
  lastName: 'Customer',
  email: uniqueEmail('cust'),
  mobile: '9876543210',
  gender: 'MALE',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  customerType: 'INDIVIDUAL',
  status: 'ACTIVE',
});

describe('Customer API', () => {
  it('requires a token (401 when missing)', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.status).toBe(401);
  });

  it('rejects an invalid token with 401', async () => {
    const res = await request(app).get('/api/customers').set('Authorization', 'Bearer invalid.token.here');
    expect(res.status).toBe(401);
  });

  it('lists customers with pagination shape', async () => {
    const res = await request(app).get('/api/customers?page=1&limit=5').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items).toBeDefined();
    expect(res.body.data.pagination.page).toBe(1);
    expect(res.body.data.pagination.totalItems).toBeGreaterThanOrEqual(1);
  });

  it('supports search', async () => {
    const res = await request(app)
      .get('/api/customers?search=rahul')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });

  it('supports filtering by status', async () => {
    const res = await request(app)
      .get('/api/customers?status=ACTIVE')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    for (const c of res.body.data.items) expect(c.status).toBe('ACTIVE');
  });

  it('supports sorting', async () => {
    const res = await request(app)
      .get('/api/customers?sortBy=firstName&sortOrder=asc&limit=10')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    const names = res.body.data.items.map((c: { firstName: string }) => c.firstName);
    expect(names).toEqual([...names].sort());
  });

  it('creates a customer as USER (201)', async () => {
    const res = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validCustomer());
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeDefined();
  });

  it('fails validation with 400 for bad email/mobile', async () => {
    const res = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ ...validCustomer(), email: 'bad', mobile: '123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('gets / updates / deletes a customer; USER delete is 403', async () => {
    const created = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validCustomer());
    const id = created.body.data.id as number;

    const fetched = await request(app).get(`/api/customers/${id}`).set('Authorization', `Bearer ${userToken}`);
    expect(fetched.status).toBe(200);

    const updated = await request(app)
      .put(`/api/customers/${id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ ...validCustomer(), email: uniqueEmail('upd'), firstName: 'Updated', city: 'Pune' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.firstName).toBe('Updated');

    const denied = await request(app)
      .delete(`/api/customers/${id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(denied.status).toBe(403);

    const deleted = await request(app)
      .delete(`/api/customers/${id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect([200, 204]).toContain(deleted.status);

    const gone = await request(app).get(`/api/customers/${id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(gone.status).toBe(404);
  });

  it('returns 404 for a nonexistent customer', async () => {
    const res = await request(app).get('/api/customers/999999').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});
