import { z } from 'zod';
import { USER_ROLES } from '../utils/constants.js';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().toLowerCase(),
  password: z.string().min(6).max(72),
  role: z.enum(Object.values(USER_ROLES)).default(USER_ROLES.CLIENT),
});

export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1),
});
