import { Briefcase, Info, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import GigManagementCard from '../../components/gigs/GigManagementCard.jsx';
import { TableSkeleton } from '../../components/ui/Skeleton.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Button from '../../components/ui/Button.jsx';
import { useDeleteGig, useMyGigs } from '../../features/gigs/gigHooks.js';
import { ROUTES } from '../../lib/constants.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

export default function MyGigs() {
  const { data: myGigs, isLoading, isError, error, refetch } = useMyGigs();
  const deleteGig = useDeleteGig();

  function handleDelete(gigId) {
    deleteGig.mutate(gigId);
  }

  return (
    <DashboardLayout
      title="My Gigs"
      description="Manage the gigs you've published."
      actions={
        <Link to={ROUTES.creatorNewGig}>
          <Button icon={PlusCircle}>Create Gig</Button>
        </Link>
      }
    >
      <div className="mb-4 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        New or edited gigs are held from the public marketplace until review. Approved active gigs appear in the public
        feed; pending, flagged, rejected, paused, booked, or inactive gigs remain visible here for you.
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : isError ? (
        <ErrorState title="Couldn't load your gigs" message={getErrorMessage(error)} onRetry={refetch} />
      ) : myGigs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="You haven't published any gigs yet"
          description="Create your first gig to start receiving bookings."
          actionLabel="Create Gig"
          actionTo={ROUTES.creatorNewGig}
        />
      ) : (
        <div className="space-y-3">
          {myGigs.map((gig) => (
            <GigManagementCard
              key={gig._id}
              gig={gig}
              onDelete={handleDelete}
              isDeleting={deleteGig.isPending && deleteGig.variables === gig._id}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
