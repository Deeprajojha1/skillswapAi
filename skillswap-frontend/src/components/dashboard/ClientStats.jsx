import { CheckCircle2, Clock, ListChecks, PartyPopper } from 'lucide-react';
import StatCard from './StatCard.jsx';
import { BOOKING_STATUS } from '../../lib/constants.js';

export default function ClientStats({ bookings = [] }) {
  const pending = bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length;
  const accepted = bookings.filter((b) => b.status === BOOKING_STATUS.ACCEPTED).length;
  const completed = bookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Bookings" value={bookings.length} icon={ListChecks} tone="slate" />
      <StatCard label="Pending" value={pending} icon={Clock} tone="amber" />
      <StatCard label="Accepted" value={accepted} icon={CheckCircle2} tone="indigo" />
      <StatCard label="Completed" value={completed} icon={PartyPopper} tone="emerald" />
    </div>
  );
}
