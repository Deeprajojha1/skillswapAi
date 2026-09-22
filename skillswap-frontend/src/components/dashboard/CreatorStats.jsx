import { Briefcase, CheckCircle2, Clock, PartyPopper } from 'lucide-react';
import StatCard from './StatCard.jsx';
import { BOOKING_STATUS, GIG_STATUS } from '../../lib/constants.js';

export default function CreatorStats({ gigs = [], bookings = [] }) {
  const activeGigs = gigs.filter((g) => g.status === GIG_STATUS.ACTIVE).length;
  const pending = bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length;
  const accepted = bookings.filter((b) => b.status === BOOKING_STATUS.ACCEPTED).length;
  const completed = bookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Active Gigs" value={activeGigs} icon={Briefcase} tone="indigo" />
      <StatCard label="Pending Requests" value={pending} icon={Clock} tone="amber" />
      <StatCard label="Accepted Bookings" value={accepted} icon={CheckCircle2} tone="indigo" />
      <StatCard label="Completed Bookings" value={completed} icon={PartyPopper} tone="emerald" />
    </div>
  );
}
