import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, Inbox, PlusCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import DashboardHeader from '../../components/dashboard/DashboardHeader.jsx';
import CreatorStats from '../../components/dashboard/CreatorStats.jsx';
import IncomingBookingCard from '../../components/dashboard/IncomingBookingCard.jsx';
import { DashboardSkeleton } from '../../components/ui/Skeleton.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Button from '../../components/ui/Button.jsx';
import { useMyGigs } from '../../features/gigs/gigHooks.js';
import { useIncomingBookings } from '../../features/bookings/bookingHooks.js';
import { selectCurrentUser } from '../../app/store/slices/authSlice.js';
import { ROUTES } from '../../lib/constants.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

export default function CreatorDashboard() {
  const user = useSelector(selectCurrentUser);
  const gigsQuery = useMyGigs();
  const bookingsQuery = useIncomingBookings();
  const myGigs = gigsQuery.data || [];

  const recentBookings = (bookingsQuery.data || []).slice(0, 5);
  const isLoading = gigsQuery.isLoading || bookingsQuery.isLoading;
  const isError = gigsQuery.isError || bookingsQuery.isError;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader
          title={`Welcome back, ${user?.name?.split(' ')[0] || 'creator'}`}
          description="Here's what's happening with your gigs today."
          actions={
            <Link to={ROUTES.creatorNewGig}>
              <Button variant="secondary" icon={PlusCircle} className="bg-white">
                Create Gig
              </Button>
            </Link>
          }
        />

        {isLoading ? (
          <DashboardSkeleton />
        ) : isError ? (
          <ErrorState
            title="Couldn't load your dashboard"
            message={getErrorMessage(gigsQuery.error || bookingsQuery.error)}
            onRetry={() => {
              gigsQuery.refetch();
              bookingsQuery.refetch();
            }}
          />
        ) : (
          <>
            <CreatorStats gigs={myGigs} bookings={bookingsQuery.data || []} />

            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Recent booking requests</h2>
              <Link
                to={ROUTES.creatorBookings}
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="No booking requests yet"
                description="Once clients start booking your gigs, they'll show up here."
              />
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <IncomingBookingCard key={booking._id} booking={booking} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
