import { useSimilarGigs } from '../../features/gigs/gigHooks.js';
import { GigGridSkeleton } from '../ui/Skeleton.jsx';
import GigCard from './GigCard.jsx';

export default function SimilarGigs({ gigId }) {
  const { data: gigs, isLoading, isError } = useSimilarGigs(gigId);

  if (isError) return null;
  if (!isLoading && (!gigs || gigs.length === 0)) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Similar creators you may like</h2>
      {isLoading ? (
        <GigGridSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      )}
    </section>
  );
}
