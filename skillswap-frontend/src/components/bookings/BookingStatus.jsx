import { Ban, CheckCircle2, Clock, PartyPopper, XCircle } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import { BOOKING_STATUS, BOOKING_STATUS_LABEL } from '../../lib/constants.js';

const CONFIG = {
  [BOOKING_STATUS.PENDING]: { tone: 'warning', icon: Clock },
  [BOOKING_STATUS.ACCEPTED]: { tone: 'info', icon: CheckCircle2 },
  [BOOKING_STATUS.DECLINED]: { tone: 'danger', icon: XCircle },
  [BOOKING_STATUS.CANCELLED]: { tone: 'neutral', icon: Ban },
  [BOOKING_STATUS.COMPLETED]: { tone: 'success', icon: PartyPopper },
};

export default function BookingStatus({ status }) {
  const config = CONFIG[status] || CONFIG[BOOKING_STATUS.PENDING];
  return (
    <Badge tone={config.tone} icon={config.icon}>
      {BOOKING_STATUS_LABEL[status] || status}
    </Badge>
  );
}
