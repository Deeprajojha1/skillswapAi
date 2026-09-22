import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Pencil } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import Image from '../../components/ui/Image.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Dialog from '../../components/ui/Dialog.jsx';
import { PageLoader } from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import AvailabilityBadge from '../../components/marketplace/AvailabilityBadge.jsx';
import CreatorMiniCard from '../../components/marketplace/CreatorMiniCard.jsx';
import SimilarGigs from '../../components/marketplace/SimilarGigs.jsx';
import BookingForm from '../../components/bookings/BookingForm.jsx';
import { useGig } from '../../features/gigs/gigHooks.js';
import { useCreateBooking } from '../../features/bookings/bookingHooks.js';
import { selectCurrentUser } from '../../app/store/slices/authSlice.js';
import { GIG_STATUS, ROUTES, USER_ROLES } from '../../lib/constants.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';
import { toastError } from '../../services/toast.js';

export default function GigDetails() {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { data: gig, isLoading, isError, error, refetch } = useGig(gigId);
  const createBooking = useCreateBooking();

  if (isLoading) return <PageLoader label="Loading gig…" />;

  if (isError) {
    return (
      <PageContainer>
        <ErrorState
          title="Couldn't load this gig"
          message={getErrorMessage(error)}
          onRetry={refetch}
          isNetworkError={error?.normalized?.status === null}
        />
      </PageContainer>
    );
  }

  const userId = user?._id || user?.id;
  const creatorId = gig.creator?._id || gig.creator?.id;
  const isOwner = userId && userId === creatorId;
  const isAvailable = gig.status === GIG_STATUS.ACTIVE;

  function handleBookClick() {
    setIsBookingOpen(true);
  }

  async function handleBookingSubmit(values) {
    try {
      const booking = await createBooking.mutateAsync({
        gigId,
        requirements: values.requirements,
        deadline: values.deadline || undefined,
      });
      setIsBookingOpen(false);
      navigate(ROUTES.clientBookingDetails(booking._id));
    } catch (err) {
      toastError(getErrorMessage(err, "Couldn't create this booking."));
    }
  }

  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200">
            <Image src={gig.image?.url} alt={gig.title} className="aspect-[16/9] w-full" />
            <div className="absolute left-3 top-3 flex gap-1.5">
              <Badge tone="brand" className="bg-white/95 shadow-sm">
                {gig.category}
              </Badge>
              <AvailabilityBadge status={gig.status} />
            </div>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">{gig.title}</h1>

          <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">{gig.description}</div>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-slate-500">Rate</dt>
              <dd className="text-sm font-semibold text-slate-900">{formatCurrency(gig.rate)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Duration</dt>
              <dd className="text-sm font-semibold text-slate-900">{gig.duration}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Max active bookings</dt>
              <dd className="text-sm font-semibold text-slate-900">{gig.maxActiveBookings ?? 1}</dd>
            </div>
          </dl>

          <SimilarGigs gigId={gigId} />
        </div>

        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(gig.rate)}</p>
            <p className="text-xs text-slate-500">{gig.duration}</p>

            <div className="mt-4">
              {isOwner ? (
                <Button fullWidth icon={Pencil} onClick={() => navigate(ROUTES.creatorEditGig(gig._id))}>
                  Edit Gig
                </Button>
              ) : user?.role === USER_ROLES.CREATOR ? (
                <p className="rounded-lg bg-slate-50 p-3 text-center text-xs text-slate-500">
                  Creator accounts can’t book other gigs.
                </p>
              ) : (
                <Button fullWidth disabled={!isAvailable} onClick={handleBookClick}>
                  {isAvailable ? 'Book Gig' : 'Currently unavailable'}
                </Button>
              )}
            </div>
          </div>

          <CreatorMiniCard creator={gig.creator} />
        </div>
      </div>

      <Dialog isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} title={`Book "${gig.title}"`} size="lg">
        <BookingForm onSubmit={handleBookingSubmit} isSubmitting={createBooking.isPending} />
      </Dialog>
    </PageContainer>
  );
}
