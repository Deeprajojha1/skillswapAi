import { Router } from 'express';
import { createOrder, verify, webhook } from '../controllers/payment.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createPaymentOrderSchema, verifyPaymentSchema } from '../validators/payment.validator.js';

const router = Router();

router.post('/webhook', webhook);
router.use(requireAuth);
router.post('/create-order', requireRole('client', 'admin'), validate(createPaymentOrderSchema), createOrder);
router.post('/verify', requireRole('client', 'admin'), validate(verifyPaymentSchema), verify);

export default router;
