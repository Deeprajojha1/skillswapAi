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

describe('gig routes', () => {
  it('shows newly created gigs in the public feed', async () => {
    const created = await request(app)
      .post('/api/gigs')
      .set('x-skillswap-role', 'creator')
      .send({ title: 'Build a portfolio', description: 'A polished responsive portfolio site.', category: 'Web Development', rate: 200 });

    expect(created.status).toBe(201);
    expect(created.body.data.moderationStatus).toBe('approved');
    expect(created.body.data.status).toBe('active');

    const list = await request(app).get('/api/gigs');
    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.data[0]._id).toBe(created.body.data._id);

    const publicDetail = await request(app).get(`/api/gigs/${created.body.data._id}`);
    expect(publicDetail.status).toBe(200);
  });

  it('lets admin approve gigs and public feed orders low-risk newest first', async () => {
    const olderHighRisk = await request(app)
      .post('/api/gigs')
      .set('x-skillswap-role', 'creator')
      .send({ title: 'Older high risk gig', description: 'A reviewed but higher risk service.', category: 'Writing', rate: 300 });

    const newerLowRisk = await request(app)
      .post('/api/gigs')
      .set('x-skillswap-role', 'creator')
      .send({ title: 'Newer low risk gig', description: 'A reviewed and lower risk service.', category: 'Writing', rate: 250 });

    await request(app)
      .patch(`/api/gigs/${olderHighRisk.body.data._id}/review`)
      .set('x-skillswap-role', 'admin')
      .send({ moderationStatus: 'approved', riskScore: 80, reviewNote: 'Approved with high risk' })
      .expect(200);

    await request(app)
      .patch(`/api/gigs/${newerLowRisk.body.data._id}/review`)
      .set('x-skillswap-role', 'admin')
      .send({ moderationStatus: 'approved', riskScore: 10, reviewNote: 'Approved' })
      .expect(200);

    const list = await request(app).get('/api/gigs?category=Writing');
    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(2);
    expect(list.body.data[0]._id).toBe(newerLowRisk.body.data._id);
    expect(list.body.data[1]._id).toBe(olderHighRisk.body.data._id);
  });

  it('moves approved gigs back to review after creator edits them', async () => {
    const created = await request(app)
      .post('/api/gigs')
      .set('x-skillswap-role', 'creator')
      .send({ title: 'Editable approved gig', description: 'A gig that will be edited after approval.', category: 'Music', rate: 500 });

    await request(app)
      .patch(`/api/gigs/${created.body.data._id}/review`)
      .set('x-skillswap-role', 'admin')
      .send({ moderationStatus: 'approved', riskScore: 5 })
      .expect(200);

    const beforeEdit = await request(app).get('/api/gigs?category=Music');
    expect(beforeEdit.body.data).toHaveLength(1);

    const edited = await request(app)
      .patch(`/api/gigs/${created.body.data._id}`)
      .set('x-skillswap-role', 'creator')
      .send({ description: 'Edited claim content must go through review again.' });

    expect(edited.status).toBe(200);
    expect(edited.body.data.moderationStatus).toBe('pending');
    expect(edited.body.data.status).toBe('paused');
    expect(edited.body.data.flags.length).toBeGreaterThan(0);

    const afterEdit = await request(app).get('/api/gigs?category=Music');
    expect(afterEdit.body.data).toHaveLength(0);
  });

  it('lets the creator delete their gig', async () => {
    const created = await request(app)
      .post('/api/gigs')
      .set('x-skillswap-role', 'creator')
      .send({ title: 'Gig to delete', description: 'This gig will be removed by its creator.', category: 'Tutoring', rate: 150 });

    await request(app)
      .delete(`/api/gigs/${created.body.data._id}`)
      .set('x-skillswap-role', 'creator')
      .expect(200);

    await request(app)
      .get(`/api/gigs/${created.body.data._id}`)
      .expect(404);
  });
});
