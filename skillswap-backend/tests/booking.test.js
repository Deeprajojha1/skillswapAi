import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import app from '../src/app.js';

let mongo;
let clientToken;
let creatorToken;
let gigId;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  const creator = await request(app).post('/api/auth/register').send({
    name: 'Creator',
    email: 'creator-booking@skillswap.local',
    password: 'password123',
    role: 'creator',
  });

  const client = await request(app).post('/api/auth/register').send({
    name: 'Client',
    email: 'client-booking@skillswap.local',
    password: 'password123',
    role: 'client',
  });

  clientToken = client.body.data.token;
  creatorToken = creator.body.data.token;
  const gig = await request(app)
    .post('/api/gigs')
    .set('Authorization', `Bearer ${creator.body.data.token}`)
    .send({ title: 'Logo refresh', description: 'Refresh an existing logo and brand direction.', category: 'Graphic Design', rate: 150 });

  gigId = gig.body.data._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('booking routes', () => {
  it('creates a booking for a gig', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ gigId, deadline: new Date(Date.now() + 86400000).toISOString(), requirements: 'I need this soon.' });

    expect(res.status).toBe(201);
    expect(res.body.data.amount).toBe(150);
    expect(res.body.data.status).toBe('pending');
  });

  it('prevents duplicate active booking requests', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ gigId, requirements: 'Trying to book the same gig again.' });

    expect(res.status).toBe(409);
  });

  it('accepts a booking and makes the gig unavailable', async () => {
    const incoming = await request(app).get('/api/bookings/incoming').set('Authorization', `Bearer ${creatorToken}`);
    const bookingId = incoming.body.data[0]._id;

    const accepted = await request(app).patch(`/api/bookings/${bookingId}/accept`).set('Authorization', `Bearer ${creatorToken}`);
    expect(accepted.status).toBe(200);
    expect(accepted.body.data.status).toBe('accepted');

    const otherClient = await request(app).post('/api/auth/register').send({
      name: 'Other Client',
      email: 'other-client@skillswap.local',
      password: 'password123',
      role: 'client',
    });

    const unavailable = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${otherClient.body.data.token}`)
      .send({ gigId, requirements: 'Can I book this inactive gig?' });

    expect(unavailable.status).toBe(400);
  });

  it('creates and verifies a payment for an accepted booking', async () => {
    const incoming = await request(app).get('/api/bookings/incoming').set('Authorization', `Bearer ${creatorToken}`);
    const bookingId = incoming.body.data[0]._id;

    const order = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ bookingId });

    expect(order.status).toBe(201);
    expect(order.body.data.amount).toBe(150);

    const verified = await request(app)
      .post('/api/payments/verify')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        orderId: order.body.data.orderId,
        paymentId: 'mock_payment_1',
        signature: 'mock_valid_signature',
      });

    expect(verified.status).toBe(200);
    expect(verified.body.data.status).toBe('paid');
  });

  it('returns persistent notifications for the creator', async () => {
    const res = await request(app).get('/api/notifications').set('Authorization', `Bearer ${creatorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
