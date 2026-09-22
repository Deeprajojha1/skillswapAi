import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import app from '../src/app.js';

let mongo;
let clientToken;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  const client = await request(app).post('/api/auth/register').send({
    name: 'Validation Client',
    email: 'validation-client@skillswap.local',
    password: 'password123',
    role: 'client',
  });
  clientToken = client.body.data.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('validation and authorization', () => {
  it('rejects invalid registration payload', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'A',
      email: 'not-an-email',
      password: '123',
      role: 'client',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects protected route without auth', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });

  it('rejects client creating creator-only gig', async () => {
    const res = await request(app)
      .post('/api/gigs')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        title: 'Invalid client gig',
        description: 'Client should not be allowed to create this gig.',
        category: 'Graphic Design',
        rate: 100,
      });

    expect(res.status).toBe(403);
  });

  it('rejects invalid booking id validation', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        gigId: 'bad-id',
        requirements: 'Need a valid gig id.',
      });

    expect(res.status).toBe(400);
  });
});
