import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import app from '../src/app.js';

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('validation and authorization', () => {
  it('rejects removed auth routes', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(404);
  });

  it('rejects client creating creator-only gig', async () => {
    const res = await request(app)
      .post('/api/gigs')
      .set('x-skillswap-role', 'client')
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
      .set('x-skillswap-role', 'client')
      .send({
        gigId: 'bad-id',
        requirements: 'Need a valid gig id.',
      });

    expect(res.status).toBe(400);
  });
});
