import ApiError from '../utils/ApiError.js';
import Gig from '../models/Gig.js';
import { GIG_STATUS } from '../utils/constants.js';

export function listGigs({ search = '', category = '' } = {}) {
  const filter = { status: GIG_STATUS.ACTIVE };
  if (category && category !== 'All') filter.category = category;
  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ title: regex }, { description: regex }, { category: regex }];
  }
  return Gig.find(filter).populate('creator', 'name email bio skills').sort({ createdAt: -1 });
}

export async function getGigById(id) {
  const gig = await Gig.findById(id).populate('creator', 'name email bio skills');
  if (!gig) throw new ApiError(404, 'Gig not found');
  return gig;
}

export function createGig(payload, creatorId) {
  return Gig.create({ ...payload, creator: creatorId });
}

export async function updateGig(id, payload, user) {
  const gig = await Gig.findById(id);
  if (!gig) throw new ApiError(404, 'Gig not found');
  if (gig.creator.toString() !== user.id && user.role !== 'admin') {
    throw new ApiError(403, 'Only the creator can update this gig');
  }
  Object.assign(gig, payload);
  return gig.save();
}
