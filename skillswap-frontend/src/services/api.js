import { BOOKINGS, GIGS } from '../utils/constants.js';

const wait = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 200));

export const api = {
  getGigs: async () => wait(GIGS),
  getGig: async (id) => wait(GIGS.find((gig) => gig.id === id)),
  getBookings: async () => wait(BOOKINGS),
  createBooking: async (payload) => wait({ id: `B-${Date.now()}`, status: 'requested', ...payload }),
  createGig: async (payload) => wait({ id: payload.title.toLowerCase().replace(/\s+/g, '-'), ...payload }),
};
