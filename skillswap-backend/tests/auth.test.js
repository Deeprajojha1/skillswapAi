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

describe('auth routes', () => {
  it('registers and logs in a user', async () => {
    const register = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@skillswap.local',
      password: 'password123',
      role: 'client',
    });

    expect(register.status).toBe(201);
    expect(register.body.data.token).toBeTruthy();
    expect(register.headers['set-cookie']?.join(';')).toContain('skillswap_token');

    const login = await request(app).post('/api/auth/login').send({
      email: 'test@skillswap.local',
      password: 'password123',
    });

    expect(login.status).toBe(200);
    expect(login.body.data.user.email).toBe('test@skillswap.local');
    expect(login.headers['set-cookie']?.join(';')).toContain('HttpOnly');
  });
});
