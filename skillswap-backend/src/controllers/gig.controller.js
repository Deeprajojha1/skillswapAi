import { similarGigs } from '../services/discovery.service.js';
import { createGig, getGigById, listGigs, updateGig } from '../services/gig.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../utils/response.js';

export const getGigs = asyncHandler(async (req, res) => {
  sendSuccess(res, await listGigs(req.query));
});

export const getGig = asyncHandler(async (req, res) => {
  sendSuccess(res, await getGigById(req.params.id));
});

export const postGig = asyncHandler(async (req, res) => {
  const payload = req.uploadedImage ? { ...req.body, image: req.uploadedImage } : req.body;
  sendCreated(res, await createGig(payload, req.user.id), 'Gig created');
});

export const patchGig = asyncHandler(async (req, res) => {
  sendSuccess(res, await updateGig(req.params.id, req.body, req.user), 'Gig updated');
});

export const getSimilarGigs = asyncHandler(async (req, res) => {
  const gig = await getGigById(req.params.id);
  sendSuccess(res, await similarGigs(gig));
});
