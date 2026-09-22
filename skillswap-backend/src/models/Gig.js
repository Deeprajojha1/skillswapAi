import mongoose from 'mongoose';
import { GIG_CATEGORIES, GIG_STATUS, MODERATION_STATUS } from '../utils/constants.js';

const gigSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: GIG_CATEGORIES, required: true },
    rate: { type: Number, required: true, min: 1 },
    duration: { type: String, default: '1 day' },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: null },
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    maxActiveBookings: { type: Number, default: 1, min: 1 },
    status: { type: String, enum: Object.values(GIG_STATUS), default: GIG_STATUS.ACTIVE },
    moderationStatus: {
      type: String,
      enum: Object.values(MODERATION_STATUS),
      default: MODERATION_STATUS.PENDING,
    },
    riskScore: { type: Number, default: 0, min: 0, max: 100 },
    flags: [
      {
        reason: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    reviewNote: { type: String, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    lastSubmittedAt: { type: Date, default: Date.now },
    editCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

gigSchema.index({ title: 'text', description: 'text', category: 1, status: 1, moderationStatus: 1 });
gigSchema.index({ moderationStatus: 1, riskScore: 1, createdAt: -1 });

export default mongoose.model('Gig', gigSchema);
