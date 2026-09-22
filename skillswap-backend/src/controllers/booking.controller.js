import {
  acceptBooking,
  cancelBooking,
  completeBooking,
  createBooking,
  declineBooking,
  getBookingById,
  listBookings,
  listClientBookings,
  listIncomingBookings,
} from '../services/booking.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../utils/response.js';

export const getBookings = asyncHandler(async (req, res) => {
  sendSuccess(res, await listBookings(req.user));
});

export const getMyBookings = asyncHandler(async (req, res) => {
  sendSuccess(res, await listClientBookings(req.user));
});

export const getIncomingBookings = asyncHandler(async (req, res) => {
  sendSuccess(res, await listIncomingBookings(req.user));
});

export const getBooking = asyncHandler(async (req, res) => {
  sendSuccess(res, await getBookingById(req.params.id, req.user));
});

export const postBooking = asyncHandler(async (req, res) => {
  sendCreated(res, await createBooking(req.body, req.user.id), 'Booking requested');
});

export const accept = asyncHandler(async (req, res) => {
  sendSuccess(res, await acceptBooking(req.params.id, req.user), 'Booking accepted');
});

export const decline = asyncHandler(async (req, res) => {
  sendSuccess(res, await declineBooking(req.params.id, req.body.reason, req.user), 'Booking declined');
});

export const cancel = asyncHandler(async (req, res) => {
  sendSuccess(res, await cancelBooking(req.params.id, req.body.reason, req.user), 'Booking cancelled');
});

export const complete = asyncHandler(async (req, res) => {
  sendSuccess(res, await completeBooking(req.params.id, req.user), 'Booking completed');
});
