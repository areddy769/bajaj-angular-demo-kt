import request from 'supertest';
import { app, ensureTestData, closeDb } from './helpers';
import { prisma } from '../src/config/prisma';
import { hashPassword } from '../src/utils/password';

beforeAll(async () => {
  await ensureTestData();
});

afterAll(async () => {
  await closeDb();
});

describe('Auth API', () => {
  it('logs in with valid admin credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Admin@123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('admin@example.com');
    expect(res.body.data.user.role).toBe('ADMIN');
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('logs in with valid user credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'User@123' });

    expect(res.status).toBe(200);
    expect(res.body.data.user.role).toBe('USER');
  });

  it('rejects invalid password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Wrong@123' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects unknown email with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'Whatever@123' });

    expect(res.status).toBe(401);
  });

  it('rejects inactive user with 403', async () => {
    const email = `inactive-${Date.now()}@example.com`;
    await prisma.user.create({
      data: { name: 'Inactive', email, passwordHash: await hashPassword('Pass@123'), role: 'USER', status: 'INACTIVE' },
    });

    const res = await request(app).post('/api/auth/login').send({ email, password: 'Pass@123' });
    expect(res.status).toBe(403);

    await prisma.user.delete({ where: { email } });
  });

  it('rejects invalid body with 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email' });
    expect(res.status).toBe(400);
  });
});
