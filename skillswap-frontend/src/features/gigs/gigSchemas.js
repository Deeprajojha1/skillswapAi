import { z } from 'zod';
import { GIG_CATEGORIES } from '../../lib/constants.js';

// Mirrors skillswap-backend/src/validators/gig.validator.js (createGigSchema).
// Used for both create and edit — the edit page pre-fills every field, so
// there is no need for a separate `.partial()` version on the client.
export const gigFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title must be under 120 characters'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(3000, 'Description must be under 3000 characters'),
  category: z.enum(GIG_CATEGORIES, { message: 'Select a category' }),
  rate: z.coerce
    .number({ message: 'Rate must be a number' })
    .positive('Rate must be greater than 0'),
  duration: z.string().trim().max(60, 'Duration must be under 60 characters').min(1, 'Duration is required'),
});

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // mirrors backend multer limit
