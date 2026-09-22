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

describe('demo role mode', () => {
  it('returns a client demo user by default', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('client');
  });

  it('switches user context from request header', async () => {
    const res = await request(app).get('/api/users/me').set('x-skillswap-role', 'creator');
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('creator');
  });
});
