import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Info } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import GigGrid from '../../components/marketplace/GigGrid.jsx';
import { useGigs } from '../../features/gigs/gigHooks.js';

/**
 * The backend has no dedicated "public creator profile" endpoint (only
 * `GET /users/me` exists for the logged-in user) and gig listing has no
 * creator filter param, so this page fetches the active gig feed and
 * derives the creator's public info + gig list client-side from the
 * populated `gig.creator` field. This means only creators with at least one
 * currently ACTIVE gig are visible here — a real backend enhancement (e.g.
 * `GET /users/:id` and `GET /gigs?creator=`) would remove that limitation.
 */
export default function CreatorProfile() {
  const { userId } = useParams();
  const { data: gigs, isLoading, isError, error, refetch } = useGigs({});

  const creatorGigs = useMemo(
    () => (gigs || []).filter((gig) => (gig.creator?._id || gig.creator?.id) === userId),
    [gigs, userId],
  );
  const creator = creatorGigs[0]?.creator;

  return (
    <PageContainer>
      {isLoading ? null : creator ? (
        <div className="mb-8 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-center sm:flex-row sm:items-start sm:text-left">
          <Avatar name={creator.name} size="lg" />
          <div>
            <h1 className="text-xl font-bold text-slate-900">{creator.name}</h1>
            {creator.bio ? <p className="mt-1 max-w-xl text-sm text-slate-500">{creator.bio}</p> : null}
            {creator.skills?.length ? (
              <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                {creator.skills.map((skill) => (
                  <Badge key={skill} tone="brand">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          This creator has no currently active gigs, so their profile can’t be shown right now.
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold text-slate-900">Gigs by this creator</h2>
      <GigGrid
        gigs={creatorGigs}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        emptyTitle="No active gigs"
        emptyDescription="This creator doesn't have any active gigs right now."
      />
    </PageContainer>
  );
}
