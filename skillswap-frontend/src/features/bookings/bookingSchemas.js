import { z } from 'zod';

// Mirrors skillswap-backend/src/validators/booking.validator.js
export const createBookingSchema = z.object({
  requirements: z
    .string()
    .trim()
    .min(5, 'Please describe your requirements (at least 5 characters)')
    .max(3000, 'Requirements must be under 3000 characters'),
  deadline: z.string().optional().or(z.literal('')),
});

export const declineBookingSchema = z.object({
  reason: z.string().trim().max(500, 'Reason must be under 500 characters').optional().or(z.literal('')),
});

export const cancelBookingSchema = z.object({
  reason: z.string().trim().max(500, 'Reason must be under 500 characters').optional().or(z.literal('')),
});
