import mongoose from 'mongoose';
import { PAYMENT_RECORD_STATUS } from '../utils/constants.js';

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: String, required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: Object.values(PAYMENT_RECORD_STATUS), default: PAYMENT_RECORD_STATUS.CREATED },
    receipt: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    paidAt: { type: Date, default: null },
    failureReason: { type: String, default: '' },
  },
  { timestamps: true },
);

paymentSchema.index({ booking: 1 }, { unique: true });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ paymentId: 1 }, { unique: true, sparse: true });

export default mongoose.model('Payment', paymentSchema);
