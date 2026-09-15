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

describe('User management API (ADMIN-only)', () => {
  it('lets ADMIN list users', async () => {
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThanOrEqual(2);
    for (const u of res.body.data.items) expect(u.passwordHash).toBeUndefined();
  });

  it('denies USER with 403', async () => {
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  it('denies missing token with 401', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  it('creates / updates / activates-deactivates a user as ADMIN', async () => {
    const email = uniqueEmail('newuser');
    const created = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'John Doe', email, password: 'Password@123', role: 'USER', status: 'ACTIVE' });
    expect(created.status).toBe(201);
    expect(created.body.data.passwordHash).toBeUndefined();
    const id = created.body.data.id as number;

    const duplicate = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'John Doe', email, password: 'Password@123', role: 'USER', status: 'ACTIVE' });
    expect(duplicate.status).toBe(409);

    const updated = await request(app)
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'John Updated' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.name).toBe('John Updated');

    const deactivated = await request(app)
      .patch(`/api/users/${id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'INACTIVE' });
    expect(deactivated.status).toBe(200);
    expect(deactivated.body.data.status).toBe('INACTIVE');

    const reactivated = await request(app)
      .patch(`/api/users/${id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'ACTIVE' });
    expect(reactivated.status).toBe(200);
  });

  it('returns 404 for unknown user', async () => {
    const res = await request(app).get('/api/users/999999').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});
