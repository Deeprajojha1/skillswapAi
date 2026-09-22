import { Ban, CheckCircle2, Clock, PauseCircle } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import { GIG_STATUS } from '../../lib/constants.js';

const CONFIG = {
  [GIG_STATUS.ACTIVE]: { label: 'Available', tone: 'success', icon: CheckCircle2 },
  [GIG_STATUS.BOOKED]: { label: 'Booked', tone: 'warning', icon: Clock },
  [GIG_STATUS.PAUSED]: { label: 'Paused', tone: 'neutral', icon: PauseCircle },
  [GIG_STATUS.INACTIVE]: { label: 'Inactive', tone: 'danger', icon: Ban },
};

export default function AvailabilityBadge({ status }) {
  const config = CONFIG[status] || CONFIG[GIG_STATUS.ACTIVE];
  return (
    <Badge tone={config.tone} icon={config.icon}>
      {config.label}
    </Badge>
  );
}
