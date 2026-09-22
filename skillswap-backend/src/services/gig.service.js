import ApiError from '../utils/ApiError.js';
import Gig from '../models/Gig.js';
import { GIG_STATUS, MODERATION_STATUS } from '../utils/constants.js';

export function listGigs({ search = '', category = '' } = {}) {
  const filter = {
    status: GIG_STATUS.ACTIVE,
    moderationStatus: MODERATION_STATUS.APPROVED,
  };
  if (category && category !== 'All') filter.category = category;
  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: regex }, { description: regex }, { category: regex }];
  }
  return Gig.find(filter).populate('creator', 'name email bio skills').sort({ riskScore: 1, createdAt: -1 });
}

export async function listReviewQueue({ moderationStatus = MODERATION_STATUS.PENDING } = {}) {
  return Gig.find({ moderationStatus })
    .populate('creator', 'name email bio skills')
    .sort({ riskScore: -1, lastSubmittedAt: 1, createdAt: -1 });
}

export function listMyGigs(user) {
  const filter = user.role === 'admin' ? {} : { creator: user.id };
  return Gig.find(filter).populate('creator', 'name email bio skills').sort({ updatedAt: -1, createdAt: -1 });
}

export async function getGigById(id, user = null) {
  const gig = await Gig.findById(id).populate('creator', 'name email bio skills');
  if (!gig) throw new ApiError(404, 'Gig not found');
  const ownerId = gig.creator?._id?.toString?.() || gig.creator?.id || gig.creator?.toString();
  const canPreview = user && (user.role === 'admin' || ownerId === user.id);
  const isPublic = gig.status === GIG_STATUS.ACTIVE && gig.moderationStatus === MODERATION_STATUS.APPROVED;
  if (!isPublic && !canPreview) throw new ApiError(404, 'Gig not found');
  return gig;
}

export function createGig(payload, creatorId) {
  return Gig.create({
    ...payload,
    creator: creatorId,
    status: GIG_STATUS.PAUSED,
    moderationStatus: MODERATION_STATUS.PENDING,
    lastSubmittedAt: new Date(),
  });
}

export async function updateGig(id, payload, user) {
  const gig = await Gig.findById(id);
  if (!gig) throw new ApiError(404, 'Gig not found');
  if (gig.creator.toString() !== user.id && user.role !== 'admin') {
    throw new ApiError(403, 'Only the creator can update this gig');
  }
  Object.assign(gig, payload);
  if (user.role !== 'admin') {
    gig.moderationStatus = MODERATION_STATUS.PENDING;
    gig.status = GIG_STATUS.PAUSED;
    gig.reviewNote = '';
    gig.reviewedBy = null;
    gig.reviewedAt = null;
    gig.lastSubmittedAt = new Date();
    gig.editCount += 1;
    gig.flags.push({
      reason: 'Edited after submission; requires review before public visibility.',
      createdBy: user.id,
    });
  }
  return gig.save();
}

export async function reviewGig(id, payload, reviewer) {
  const gig = await Gig.findById(id);
  if (!gig) throw new ApiError(404, 'Gig not found');

  gig.moderationStatus = payload.moderationStatus;
  gig.reviewNote = payload.reviewNote || '';
  gig.reviewedBy = reviewer.id;
  gig.reviewedAt = new Date();
  if (typeof payload.riskScore === 'number') gig.riskScore = payload.riskScore;
  if (payload.flagReason) {
    gig.flags.push({ reason: payload.flagReason, createdBy: reviewer.id });
  }

  if (payload.moderationStatus === MODERATION_STATUS.APPROVED) {
    gig.status = GIG_STATUS.ACTIVE;
  } else {
    gig.status = GIG_STATUS.PAUSED;
  }

  return gig.save();
}
