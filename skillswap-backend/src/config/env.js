import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/skillswap',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 120),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  paymentCurrency: process.env.PAYMENT_CURRENCY ?? 'INR',
  // Login identity for the demo-auth "client" account (see
  // auth.middleware.js) — no email is ever sent, this just needs to be a
  // valid, unique value for the User schema.
  demoClientEmail: process.env.DEMO_CLIENT_EMAIL ?? 'demo.client@skillswap.local',
};
