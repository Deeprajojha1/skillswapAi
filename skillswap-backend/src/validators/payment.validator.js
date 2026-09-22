import { z } from 'zod';

export const payBookingSchema = z.object({
  bookingId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid booking id'),
});
