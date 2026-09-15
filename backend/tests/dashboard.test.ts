import request from 'supertest';
import { app, ensureTestData, loginAs, closeDb } from './helpers';
import { prisma } from '../src/config/prisma';

beforeAll(async () => {
  await ensureTestData();
});

afterAll(async () => {
  await closeDb();
});

describe('Dashboard + health', () => {
  it('GET /api/health returns API is running', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('API is running');
  });

  it('requires auth for dashboard summary', async () => {
    const res = await request(app).get('/api/dashboard/summary');
    expect(res.status).toBe(401);
  });

  it('returns live counts for authenticated users', async () => {
    const token = await loginAs('user@example.com', 'User@123');
    const res = await request(app).get('/api/dashboard/summary').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);

    const [totalCustomers, activeCustomers, totalUsers] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count(),
    ]);

    expect(res.body.data.totalCustomers).toBe(totalCustomers);
    expect(res.body.data.activeCustomers).toBe(activeCustomers);
    expect(res.body.data.inactiveCustomers).toBe(totalCustomers - activeCustomers);
    expect(res.body.data.totalUsers).toBe(totalUsers);
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
  });
});
