import { z } from 'zod';

export const createBookingSchema = z.object({
  gigId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid gig id'),
  requirements: z.string().trim().min(5).max(3000),
  deadline: z.coerce.date().optional(),
});

export const declineBookingSchema = z.object({
  reason: z.string().trim().max(500).optional().default('Currently unavailable'),
});

export const cancelBookingSchema = z.object({
  reason: z.string().trim().max(500).optional().default('Cancelled by user'),
});
