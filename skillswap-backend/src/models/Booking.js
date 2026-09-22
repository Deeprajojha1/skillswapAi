import mongoose from 'mongoose';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../utils/constants.js';

const bookingSchema = new mongoose.Schema(
  {
    gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deadline: { type: Date, default: null },
    amount: { type: Number, required: true, min: 1 },
    priceSnapshot: { type: Number, required: true, min: 1 },
    currency: { type: String, default: 'INR' },
    requirements: { type: String, required: true },
    reason: { type: String, default: '' },
    declineReason: { type: String, default: '' },
    cancellationReason: { type: String, default: '' },
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    paymentStatus: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.UNPAID },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
    status: { type: String, enum: Object.values(BOOKING_STATUS), default: BOOKING_STATUS.PENDING },
    acceptedAt: { type: Date, default: null },
    declinedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

bookingSchema.index(
  { gig: 1, client: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: { $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.ACCEPTED] } } },
);

bookingSchema.index({ creator: 1, status: 1, createdAt: -1 });
bookingSchema.index({ client: 1, status: 1, createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);
