import { connectDb, disconnectDb } from '../config/db.js';
import Booking from '../models/Booking.js';
import Gig from '../models/Gig.js';
import User from '../models/User.js';

export const seedBookings = async () => {
  const client = await User.findOne({ email: 'client@skillswap.test' });
  const gig = await Gig.findOne();
  await Booking.deleteMany({});
  if (!client || !gig) return [];
  return Booking.create({
    gig: gig.id,
    client: client.id,
    creator: gig.creator,
    deadline: new Date(Date.now() + 86400000),
    amount: gig.rate,
    requirements: 'Demo booking requirements',
    status: 'accepted',
  });
};

if (import.meta.url === `file://${process.argv[1]}`) {
  await connectDb();
  await seedBookings();
  await disconnectDb();
  console.log('Seeded bookings');
}
