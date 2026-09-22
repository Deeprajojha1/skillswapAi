import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import GigForm from '../../components/gigs/GigForm.jsx';
import { PageLoader } from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { useGig, useUpdateGig } from '../../features/gigs/gigHooks.js';
import { selectCurrentUser } from '../../app/store/slices/authSlice.js';
import { ROUTES } from '../../lib/constants.js';
import { toastError } from '../../services/toast.js';
import { getErrorMessage, getFieldErrors } from '../../utils/getErrorMessage.js';

export default function EditGig() {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const { data: gig, isLoading, isError, error, refetch } = useGig(gigId);
  const updateGig = useUpdateGig(gigId);

  if (isLoading) return <PageLoader label="Loading gig…" />;

  if (isError) {
    return (
      <DashboardLayout title="Edit Gig">
        <ErrorState title="Couldn't load this gig" message={getErrorMessage(error)} onRetry={refetch} />
      </DashboardLayout>
    );
  }

  const userId = user?._id || user?.id;
  const creatorId = gig.creator?._id || gig.creator?.id;
  if (userId !== creatorId && user?.role !== 'admin') {
    return (
      <DashboardLayout title="Edit Gig">
        <ErrorState title="Not your gig" message="You can only edit gigs you created." />
      </DashboardLayout>
    );
  }

  async function handleSubmit(values) {
    try {
      // eslint-disable-next-line no-unused-vars
      const { imageFile, ...payload } = values;
      await updateGig.mutateAsync(payload);
      navigate(ROUTES.creatorGigs);
    } catch (err) {
      const fieldErrors = getFieldErrors(err);
      toastError(fieldErrors ? Object.values(fieldErrors)[0] : getErrorMessage(err, "Couldn't update this gig."));
    }
  }

  return (
    <DashboardLayout title="Edit Gig" description={gig.title}>
      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <GigForm
          mode="edit"
          defaultValues={{
            title: gig.title,
            description: gig.description,
            category: gig.category,
            rate: gig.rate,
            duration: gig.duration,
          }}
          existingImageUrl={gig.image?.url}
          onSubmit={handleSubmit}
          isSubmitting={updateGig.isPending}
        />
      </div>
    </DashboardLayout>
  );
}
