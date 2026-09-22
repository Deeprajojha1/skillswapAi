import { connectDb, disconnectDb } from '../config/db.js';
import Gig from '../models/Gig.js';
import User from '../models/User.js';
import { GIG_STATUS, MODERATION_STATUS } from '../utils/constants.js';

export const seedGigs = async () => {
  const maya = await User.findOneAndUpdate(
    { email: 'maya@skillswap.test' },
    {
      $setOnInsert: {
        name: 'Maya Chen',
        email: 'maya@skillswap.test',
        password: 'password123',
        role: 'creator',
        skills: ['Design', 'Branding'],
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  const arjun = await User.findOneAndUpdate(
    { email: 'arjun@skillswap.test' },
    {
      $setOnInsert: {
        name: 'Arjun Rao',
        email: 'arjun@skillswap.test',
        password: 'password123',
        role: 'creator',
        skills: ['React', 'Node'],
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  const gigs = [
    {
      title: 'Brand kit in a weekend',
      description: 'Logo cleanup, colors, typography, and social templates.',
      category: 'Graphic Design',
      rate: 180,
      creator: maya.id,
      duration: '2 days',
      image: {
        url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
        publicId: null,
      },
    },
    {
      title: 'React landing page build',
      description: 'Responsive Vite landing page with polished components.',
      category: 'Web Development',
      rate: 260,
      creator: arjun.id,
      duration: '4 days',
      image: {
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        publicId: null,
      },
    },
  ];

  return Promise.all(
    gigs.map((gig) => Gig.findOneAndUpdate(
      { title: gig.title, creator: gig.creator },
      {
        $set: {
          ...gig,
          status: GIG_STATUS.ACTIVE,
          moderationStatus: MODERATION_STATUS.APPROVED,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    )),
  );
};

if (import.meta.url === `file://${process.argv[1]}`) {
  await connectDb();
  await seedGigs();
  await disconnectDb();
  console.log('Seeded gigs');
}
