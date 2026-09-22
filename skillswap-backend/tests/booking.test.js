import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import app from '../src/app.js';

let mongo;
let gigId;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  const gig = await request(app)
    .post('/api/gigs')
    .set('x-skillswap-role', 'creator')
    .send({ title: 'Logo refresh', description: 'Refresh an existing logo and brand direction.', category: 'Graphic Design', rate: 150 });

  gigId = gig.body.data._id;

  await request(app)
    .patch(`/api/gigs/${gigId}/review`)
    .set('x-skillswap-role', 'admin')
    .send({ moderationStatus: 'approved', riskScore: 5 });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('booking routes', () => {
  it('creates a booking for a gig', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('x-skillswap-role', 'client')
      .send({ gigId, deadline: new Date(Date.now() + 86400000).toISOString(), requirements: 'I need this soon.' });

    expect(res.status).toBe(201);
    expect(res.body.data.amount).toBe(150);
    expect(res.body.data.status).toBe('pending');
  });

  it('prevents duplicate active booking requests', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('x-skillswap-role', 'client')
      .send({ gigId, requirements: 'Trying to book the same gig again.' });

    expect(res.status).toBe(409);
  });

  it('accepts a booking and makes the gig unavailable', async () => {
    const incoming = await request(app).get('/api/bookings/incoming').set('x-skillswap-role', 'creator');
    const bookingId = incoming.body.data[0]._id;

    const accepted = await request(app).patch(`/api/bookings/${bookingId}/accept`).set('x-skillswap-role', 'creator');
    expect(accepted.status).toBe(200);
    expect(accepted.body.data.status).toBe('accepted');

    const unavailable = await request(app)
      .post('/api/bookings')
      .set('x-skillswap-role', 'client')
      .send({ gigId, requirements: 'Can I book this inactive gig?' });

    expect(unavailable.status).toBe(400);
  });

  it('pays an accepted booking directly', async () => {
    const incoming = await request(app).get('/api/bookings/incoming').set('x-skillswap-role', 'creator');
    const bookingId = incoming.body.data[0]._id;

    const paid = await request(app)
      .post('/api/payments/pay')
      .set('x-skillswap-role', 'client')
      .send({ bookingId });

    expect(paid.status).toBe(200);
    expect(paid.body.data.amount).toBe(150);
    expect(paid.body.data.status).toBe('paid');
  });

  it('returns persistent notifications for the creator', async () => {
    const res = await request(app).get('/api/notifications').set('x-skillswap-role', 'creator');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
