import ApiError from '../utils/ApiError.js';
import { BOOKING_STATUS } from '../utils/constants.js';

const transitions = {
  [BOOKING_STATUS.PENDING]: [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.DECLINED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.ACCEPTED]: [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.COMPLETED],
  [BOOKING_STATUS.DECLINED]: [],
  [BOOKING_STATUS.CANCELLED]: [],
  [BOOKING_STATUS.COMPLETED]: [],
};

export function assertBookingTransition(current, next) {
  if (!transitions[current]?.includes(next)) {
    throw new ApiError(400, `Invalid booking transition: ${current} -> ${next}`);
  }
}
