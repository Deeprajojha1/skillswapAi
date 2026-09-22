import { Router } from 'express';
import { getGig, getGigs, getSimilarGigs, patchGig, postGig } from '../controllers/gig.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { upload, uploadImageToCloudinary } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createGigSchema, gigQuerySchema, updateGigSchema } from '../validators/gig.validator.js';

const router = Router();

router.get('/', validate(gigQuerySchema, 'query'), getGigs);
router.get('/:id', getGig);
router.get('/:id/similar', getSimilarGigs);
router.post(
  '/',
  requireAuth,
  requireRole('creator', 'admin'),
  upload.single('image'),
  uploadImageToCloudinary,
  validate(createGigSchema),
  postGig,
);
router.patch('/:id', requireAuth, requireRole('creator', 'admin'), validate(updateGigSchema), patchGig);

export default router;
