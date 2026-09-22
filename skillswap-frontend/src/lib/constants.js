// Values here mirror the backend exactly (see skillswap-backend/src/utils/constants.js).
// Keep these two files in sync if the backend enums ever change.

export const USER_ROLES = {
  CLIENT: 'client',
  CREATOR: 'creator',
  ADMIN: 'admin',
};

// There's no login/register any more — the app has a single Client/Creator
// switch instead (see hooks/useRoleSwitch.js). These are the single source
// of truth for how that choice is persisted and broadcast: apiClient reads
// ROLE_STORAGE_KEY to build the `x-skillswap-role` request header, and
// AuthProvider listens for ROLE_CHANGED_EVENT to refetch the demo user.
export const ROLE_STORAGE_KEY = 'skillswap_role';
export const ROLE_CHANGED_EVENT = 'skillswap:role-changed';

export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const BOOKING_STATUS_LABEL = {
  [BOOKING_STATUS.PENDING]: 'Pending',
  [BOOKING_STATUS.ACCEPTED]: 'Accepted',
  [BOOKING_STATUS.DECLINED]: 'Declined',
  [BOOKING_STATUS.CANCELLED]: 'Cancelled',
  [BOOKING_STATUS.COMPLETED]: 'Completed',
};

export const GIG_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  BOOKED: 'booked',
  INACTIVE: 'inactive',
};

export const GIG_STATUS_LABEL = {
  [GIG_STATUS.ACTIVE]: 'Active',
  [GIG_STATUS.PAUSED]: 'Paused',
  [GIG_STATUS.BOOKED]: 'Booked',
  [GIG_STATUS.INACTIVE]: 'Inactive',
};

export const MODERATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  FLAGGED: 'flagged',
};

export const MODERATION_STATUS_LABEL = {
  [MODERATION_STATUS.PENDING]: 'Pending review',
  [MODERATION_STATUS.APPROVED]: 'Approved',
  [MODERATION_STATUS.REJECTED]: 'Rejected',
  [MODERATION_STATUS.FLAGGED]: 'Flagged',
};

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const GIG_CATEGORIES = [
  'Graphic Design',
  'Video Editing',
  'Web Development',
  'Writing',
  'Marketing',
  'Music',
  'Tutoring',
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export const NOTIFICATION_ICON_BY_TYPE = {
  'booking.created': 'CalendarPlus',
  'booking.accepted': 'CheckCircle2',
  'booking.declined': 'XCircle',
  'booking.cancelled': 'Ban',
  'booking.completed': 'PartyPopper',
  'payment.created': 'Receipt',
  'payment.success': 'BadgeCheck',
  'payment.failed': 'AlertTriangle',
};

export const QUERY_KEYS = {
  currentUser: ['currentUser'],
  gigs: (filters) => ['gigs', filters],
  gig: (id) => ['gig', id],
  similarGigs: (id) => ['similarGigs', id],
  myGigs: ['myGigs'],
  myBookings: (filters) => ['myBookings', filters],
  booking: (id) => ['booking', id],
  incomingBookings: (filters) => ['incomingBookings', filters],
  notifications: ['notifications'],
  unreadNotifications: ['unreadNotifications'],
};

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  marketplace: '/marketplace',
  gigDetails: (id = ':gigId') => `/marketplace/${id}`,
  creatorProfile: (id = ':userId') => `/creators/${id}`,
  profile: '/profile',
  notifications: '/notifications',
  clientBookings: '/client/bookings',
  clientBookingDetails: (id = ':bookingId') => `/client/bookings/${id}`,
  clientPay: (id = ':bookingId') => `/client/pay/${id}`,
  clientNotifications: '/client/notifications',
  creatorDashboard: '/creator/dashboard',
  creatorGigs: '/creator/gigs',
  creatorNewGig: '/creator/gigs/new',
  creatorEditGig: (id = ':gigId') => `/creator/gigs/${id}/edit`,
  creatorBookings: '/creator/bookings',
  creatorBookingDetails: (id = ':bookingId') => `/creator/bookings/${id}`,
  creatorNotifications: '/creator/notifications',
  notFound: '/404',
  unauthorized: '/unauthorized',
};
