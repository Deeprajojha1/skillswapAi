import { similarGigs } from '../services/discovery.service.js';
import { createGig, getGigById, listGigs, listMyGigs, listReviewQueue, reviewGig, updateGig } from '../services/gig.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../utils/response.js';

export const getGigs = asyncHandler(async (req, res) => {
  sendSuccess(res, await listGigs(req.query));
});

export const getGig = asyncHandler(async (req, res) => {
  sendSuccess(res, await getGigById(req.params.id, req.user ?? null));
});

export const postGig = asyncHandler(async (req, res) => {
  const payload = req.uploadedImage ? { ...req.body, image: req.uploadedImage } : req.body;
  sendCreated(res, await createGig(payload, req.user.id), 'Gig created');
});

export const patchGig = asyncHandler(async (req, res) => {
  sendSuccess(res, await updateGig(req.params.id, req.body, req.user), 'Gig updated');
});

export const getSimilarGigs = asyncHandler(async (req, res) => {
  const gig = await getGigById(req.params.id, req.user ?? null);
  sendSuccess(res, await similarGigs(gig));
});

export const getReviewQueue = asyncHandler(async (req, res) => {
  sendSuccess(res, await listReviewQueue(req.query));
});

export const getMyGigs = asyncHandler(async (req, res) => {
  sendSuccess(res, await listMyGigs(req.user));
});

export const patchGigReview = asyncHandler(async (req, res) => {
  sendSuccess(res, await reviewGig(req.params.id, req.body, req.user), 'Gig review updated');
});
