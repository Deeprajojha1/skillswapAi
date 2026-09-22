import { useMemo, useState } from 'react';
import { CalendarX } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Tabs from '../../components/ui/Tabs.jsx';
import BookingCard from '../../components/bookings/BookingCard.jsx';
import BookingTable from '../../components/bookings/BookingTable.jsx';
import { BookingSkeleton } from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import ClientStats from '../../components/dashboard/ClientStats.jsx';
import { useMyBookings } from '../../features/bookings/bookingHooks.js';
import { BOOKING_STATUS, BOOKING_STATUS_LABEL, ROUTES } from '../../lib/constants.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

const TAB_VALUES = ['all', ...Object.values(BOOKING_STATUS)];

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState('all');
  const { data: bookings, isLoading, isError, error, refetch } = useMyBookings();

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
    <DashboardLayout title="My Bookings" description="Track every gig you've booked, from request to completion.">
      <div className="space-y-6">
        {bookings ? <ClientStats bookings={bookings} /> : null}

        <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

        {isLoading ? (
          <div className="space-y-3">
            <BookingSkeleton />
            <BookingSkeleton />
            <BookingSkeleton />
          </div>
        ) : isError ? (
          <ErrorState
            title="Couldn't load your bookings"
            message={getErrorMessage(error)}
            onRetry={refetch}
            isNetworkError={error?.normalized?.status === null}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={CalendarX}
            title="No bookings here"
            description="Browse the marketplace to book a gig."
            actionLabel="Browse Marketplace"
            actionTo={ROUTES.marketplace}
          />
        ) : (
          <>
            <BookingTable bookings={filtered} perspective="client" />
            <div className="space-y-4 lg:hidden">
              {filtered.map((booking) => (
                <BookingCard key={booking._id} booking={booking} perspective="client" />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
