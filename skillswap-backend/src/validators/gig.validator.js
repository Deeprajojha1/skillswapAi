import { z } from 'zod';
import { GIG_CATEGORIES, MODERATION_STATUS } from '../utils/constants.js';

const toNumber = z.coerce.number().positive();

export const createGigSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(3000),
  category: z.enum(GIG_CATEGORIES),
  rate: toNumber,
  duration: z.string().trim().max(60).default('1 day'),
  image: z.url().or(z.literal('')).optional().default(''),
});

// NOTE: this is intentionally NOT `createGigSchema.partial()`. Zod's
// `.default(...)` still fires for an omitted/undefined field even after
// `.partial()` is applied — so `Gig.findById().partial()` would silently
// resolve an omitted `duration` to "1 day" and an omitted `image` to "",
// and `updateGig()`'s `Object.assign(gig, payload)` would then overwrite
// the gig's real duration/image with those defaults on every partial edit.
// Defining the update schema's fields explicitly (no `.default()`) keeps a
// field genuinely absent from `result.data` when the client doesn't send
// it, so it's left untouched on the document.
export const updateGigSchema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  description: z.string().trim().min(10).max(3000).optional(),
  category: z.enum(GIG_CATEGORIES).optional(),
  rate: toNumber.optional(),
  duration: z.string().trim().max(60).optional(),
  image: z.url().or(z.literal('')).optional(),
});

export const gigQuerySchema = z.object({
  search: z.string().trim().max(80).optional().default(''),
  category: z.enum(['All', ...GIG_CATEGORIES]).or(z.literal('')).optional().default(''),
});

export const reviewGigSchema = z.object({
  moderationStatus: z.enum([MODERATION_STATUS.APPROVED, MODERATION_STATUS.REJECTED, MODERATION_STATUS.FLAGGED]),
  reviewNote: z.string().trim().max(1000).optional().default(''),
  riskScore: z.coerce.number().min(0).max(100).optional(),
  flagReason: z.string().trim().max(500).optional(),
});
