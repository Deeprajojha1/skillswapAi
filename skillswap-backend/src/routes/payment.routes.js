import { Router } from 'express';
import { pay } from '../controllers/payment.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { payBookingSchema } from '../validators/payment.validator.js';

const router = Router();

router.use(requireAuth);
router.post('/pay', requireRole('client', 'admin'), validate(payBookingSchema), pay);

export default router;
