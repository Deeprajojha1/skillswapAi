import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import app from '../src/app.js';

let mongo;
let creatorToken;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  const res = await request(app).post('/api/auth/register').send({
    name: 'Creator',
    email: 'creator@skillswap.local',
    password: 'password123',
    role: 'creator',
  });
  creatorToken = res.body.data.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('gig routes', () => {
  it('creates and lists gigs', async () => {
    const created = await request(app)
      .post('/api/gigs')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({ title: 'Build a portfolio', description: 'A polished responsive portfolio site.', category: 'Web Development', rate: 200 });

    expect(created.status).toBe(201);

    const list = await request(app).get('/api/gigs');
    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(1);
  });
});
