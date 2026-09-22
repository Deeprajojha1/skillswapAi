import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import GigForm from '../../components/gigs/GigForm.jsx';
import GigPreview from '../../components/gigs/GigPreview.jsx';
import { useCreateGig } from '../../features/gigs/gigHooks.js';
import { ROUTES } from '../../lib/constants.js';
import { toastError } from '../../services/toast.js';
import { getErrorMessage, getFieldErrors } from '../../utils/getErrorMessage.js';

export default function CreateGig() {
  const createGig = useCreateGig();
  const [previewValues, setPreviewValues] = useState(null);
  // Bumping this forces GigForm (and the image uploader inside it) to fully
  // remount after a successful publish — the cleanest way to reset RHF's
  // internal state, the selected file, and the live preview all at once,
  // so the page is immediately ready for the next gig instead of leaving
  // stale values behind or requiring a navigate-away-and-back round trip.
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(values) {
    try {
      await createGig.mutateAsync(values);
      setPreviewValues(null);
      setFormKey((key) => key + 1);
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
    <DashboardLayout
      title="Create Gig"
      description="Publish a new gig to the marketplace."
      actions={
        <Link
          to={ROUTES.creatorGigs}
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View My Gigs <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <GigForm
              key={formKey}
              mode="create"
              onSubmit={handleSubmit}
              isSubmitting={createGig.isPending}
              onValuesChange={setPreviewValues}
            />
          </div>
        </div>
        <div className="hidden lg:block">
          <GigPreview values={previewValues} />
        </div>
      </div>
    </DashboardLayout>
  );
}
