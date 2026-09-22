import { getUserProfile, updateUserProfile } from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, await getUserProfile(req.user.id));
});

export const updateMe = asyncHandler(async (req, res) => {
  sendSuccess(res, await updateUserProfile(req.user.id, req.body), 'Profile updated');
});
