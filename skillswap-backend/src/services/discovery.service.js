import Gig from '../models/Gig.js';
import { GIG_STATUS, MODERATION_STATUS } from '../utils/constants.js';

export function similarGigs(gig) {
  return Gig.find({
    _id: { $ne: gig.id },
    category: gig.category,
    status: GIG_STATUS.ACTIVE,
    moderationStatus: MODERATION_STATUS.APPROVED,
  })
    .sort({ riskScore: 1, createdAt: -1 })
    .limit(6);
}
