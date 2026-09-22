import { useMemo, useState } from 'react';
import { Inbox } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Tabs from '../../components/ui/Tabs.jsx';
import BookingTable from '../../components/bookings/BookingTable.jsx';
import IncomingBookingCard from '../../components/dashboard/IncomingBookingCard.jsx';
import { BookingSkeleton } from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { useIncomingBookings } from '../../features/bookings/bookingHooks.js';
import { BOOKING_STATUS, BOOKING_STATUS_LABEL } from '../../lib/constants.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

const TAB_VALUES = ['all', ...Object.values(BOOKING_STATUS)];

export default function IncomingBookings() {
  const [activeTab, setActiveTab] = useState('all');
  const { data: bookings, isLoading, isError, error, refetch } = useIncomingBookings();

  const filtered = useMemo(() => {
    if (!bookings) return [];
    if (activeTab === 'all') return bookings;
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

  const tabs = TAB_VALUES.map((value) => ({
    value,
    label: value === 'all' ? 'All' : BOOKING_STATUS_LABEL[value],
    count: bookings
      ? value === 'all'
        ? bookings.length
        : bookings.filter((b) => b.status === value).length
      : undefined,
  }));

  return (
    <DashboardLayout title="Incoming Bookings" description="Requests clients have sent for your gigs.">
      <div className="space-y-6">
        <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

        {isLoading ? (
          <div className="space-y-3">
            <BookingSkeleton />
            <BookingSkeleton />
            <BookingSkeleton />
          </div>
        ) : isError ? (
          <ErrorState title="Couldn't load bookings" message={getErrorMessage(error)} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Inbox} title="No booking requests" description="Nothing to show for this filter yet." />
        ) : (
          <>
            <BookingTable bookings={filtered} perspective="creator" />
            <div className="space-y-4 lg:hidden">
              {filtered.map((booking) => (
                <IncomingBookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
