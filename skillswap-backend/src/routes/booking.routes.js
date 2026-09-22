import { Router } from 'express';
import { accept, cancel, complete, decline, getBooking, getBookings, getIncomingBookings, getMyBookings, postBooking } from '../controllers/booking.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { cancelBookingSchema, createBookingSchema, declineBookingSchema } from '../validators/booking.validator.js';

const router = Router();

router.use(requireAuth);
router.get('/', getBookings);
router.get('/my', requireRole('client', 'admin'), getMyBookings);
router.get('/incoming', requireRole('creator', 'admin'), getIncomingBookings);
router.post('/', requireRole('client', 'admin'), validate(createBookingSchema), postBooking);
router.get('/:id', getBooking);
router.patch('/:id/accept', requireRole('creator', 'admin'), accept);
router.patch('/:id/decline', requireRole('creator', 'admin'), validate(declineBookingSchema), decline);
router.patch('/:id/cancel', validate(cancelBookingSchema), cancel);
router.patch('/:id/complete', requireRole('creator', 'admin'), complete);

export default router;
