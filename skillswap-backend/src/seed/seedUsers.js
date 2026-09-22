import { connectDb, disconnectDb } from '../config/db.js';
import User from '../models/User.js';

export const seedUsers = async () => {
  await User.deleteMany({});
  return User.insertMany([
    { name: 'Maya Chen', email: 'maya@skillswap.test', password: 'password123', role: 'creator', skills: ['Design', 'Branding'] },
    { name: 'Arjun Rao', email: 'arjun@skillswap.test', password: 'password123', role: 'creator', skills: ['React', 'Node'] },
    { name: 'Client Demo', email: 'client@skillswap.test', password: 'password123', role: 'client' },
  ]);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  await connectDb();
  await seedUsers();
  await disconnectDb();
  console.log('Seeded users');
}
