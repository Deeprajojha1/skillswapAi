import { connectDb, disconnectDb } from '../config/db.js';
export const seedGigs = async () => [];

if (import.meta.url === `file://${process.argv[1]}`) {
  await connectDb();
  const gigs = await seedGigs();
  await disconnectDb();
  console.log(`Seeded ${gigs.length} gigs`);
}
