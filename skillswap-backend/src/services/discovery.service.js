import Gig from '../models/Gig.js';
import { GIG_STATUS } from '../utils/constants.js';

export function similarGigs(gig) {
  return Gig.find({ _id: { $ne: gig.id }, category: gig.category, status: GIG_STATUS.ACTIVE }).limit(6);
}
