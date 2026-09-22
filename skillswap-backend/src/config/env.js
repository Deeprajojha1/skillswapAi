import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/skillswap',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS ?? 60),
  jwtSecret: process.env.JWT_SECRET ?? 'local-dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  jwtCookieName: process.env.JWT_COOKIE_NAME ?? 'skillswap_token',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 120),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  paymentProvider: process.env.PAYMENT_PROVIDER ?? 'mock',
  paymentKeyId: process.env.PAYMENT_KEY_ID ?? '',
  paymentKeySecret: process.env.PAYMENT_KEY_SECRET ?? '',
  paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET ?? '',
  paymentCurrency: process.env.PAYMENT_CURRENCY ?? 'INR',
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  emailFrom: process.env.EMAIL_FROM ?? 'SkillSwap <onboarding@resend.dev>',
  adminEmail: process.env.ADMIN_EMAIL ?? 'ojhadeepraj71@gmail.com',
};
