import { connectDb, disconnectDb } from '../config/db.js';
import Gig from '../models/Gig.js';
import User from '../models/User.js';

export const seedGigs = async () => {
  const maya = await User.findOne({ email: 'maya@skillswap.test' });
  const arjun = await User.findOne({ email: 'arjun@skillswap.test' });
  await Gig.deleteMany({});
  return Gig.insertMany([
    {
      title: 'Brand kit in a weekend',
      description: 'Logo cleanup, colors, typography, and social templates.',
      category: 'Graphic Design',
      rate: 180,
      creator: maya.id,
      duration: '2 days',
    },
    {
      title: 'React landing page build',
      description: 'Responsive Vite landing page with polished components.',
      category: 'Web Development',
      rate: 260,
      creator: arjun.id,
      duration: '4 days',
    },
  ]);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  await connectDb();
  await seedGigs();
  await disconnectDb();
  console.log('Seeded gigs');
}
