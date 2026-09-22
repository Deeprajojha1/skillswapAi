import { Router } from 'express';
import {
  getGig,
  getGigs,
  getMyGigs,
  getReviewQueue,
  getSimilarGigs,
  patchGig,
  patchGigReview,
  postGig,
} from '../controllers/gig.controller.js';
import { optionalAuth, requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { upload, uploadImageToCloudinary } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createGigSchema, gigQuerySchema, reviewGigSchema, updateGigSchema } from '../validators/gig.validator.js';

const router = Router();

router.get('/',  getGigs);
router.get('/mine', requireAuth, requireRole('creator', 'admin'), getMyGigs);
router.get('/review-queue', requireAuth, requireRole('admin'), getReviewQueue);
router.get('/:id', optionalAuth, getGig);
router.get('/:id/similar', optionalAuth, getSimilarGigs);
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
router.patch('/:id/review', requireAuth, requireRole('admin'), validate(reviewGigSchema), patchGigReview);

export default router;
