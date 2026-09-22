import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import GigForm from '../../components/gigs/GigForm.jsx';
import GigPreview from '../../components/gigs/GigPreview.jsx';
import { useCreateGig } from '../../features/gigs/gigHooks.js';
import { ROUTES } from '../../lib/constants.js';
import { toastError } from '../../services/toast.js';
import { getErrorMessage, getFieldErrors } from '../../utils/getErrorMessage.js';

export default function CreateGig() {
  const navigate = useNavigate();
  const createGig = useCreateGig();
  const [previewValues, setPreviewValues] = useState(null);

  async function handleSubmit(values) {
    try {
      await createGig.mutateAsync(values);
      navigate(ROUTES.creatorGigs);
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      toastError(
        fieldErrors
          ? Object.values(fieldErrors)[0]
          : getErrorMessage(error, "Couldn't create this gig."),
      );
    }
  }

  return (
    <DashboardLayout title="Create Gig" description="Publish a new gig to the marketplace.">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <GigForm mode="create" onSubmit={handleSubmit} isSubmitting={createGig.isPending} onValuesChange={setPreviewValues} />
          </div>
        </div>
        <div className="hidden lg:block">
          <GigPreview values={previewValues} />
        </div>
      </div>
    </DashboardLayout>
  );
}
