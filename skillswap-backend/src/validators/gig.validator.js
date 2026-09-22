import { z } from 'zod';
import { GIG_CATEGORIES } from '../utils/constants.js';

const toNumber = z.coerce.number().positive();

export const createGigSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(3000),
  category: z.enum(GIG_CATEGORIES),
  rate: toNumber,
  duration: z.string().trim().max(60).default('1 day'),
  image: z.url().or(z.literal('')).optional().default(''),
});

export const updateGigSchema = createGigSchema.partial();

export const gigQuerySchema = z.object({
  search: z.string().trim().max(80).optional().default(''),
  category: z.enum(['All', ...GIG_CATEGORIES]).or(z.literal('')).optional().default(''),
});
