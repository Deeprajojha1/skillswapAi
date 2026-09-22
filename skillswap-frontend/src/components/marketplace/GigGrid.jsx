import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import GigCard from './GigCard.jsx';
import { GigGridSkeleton } from '../ui/Skeleton.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import ErrorState from '../ui/ErrorState.jsx';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

export default function GigGrid({ gigs, isLoading, isError, error, onRetry, emptyTitle, emptyDescription }) {
  if (isLoading) return <GigGridSkeleton />;

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load gigs"
        message={getErrorMessage(error, "We couldn't load gigs right now.")}
        onRetry={onRetry}
        isNetworkError={error?.normalized?.status === null}
      />
    );
  }

  if (!gigs || gigs.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title={emptyTitle || 'No gigs found'}
        description={emptyDescription || 'Try a different search term or category.'}
      />
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {gigs.map((gig) => (
        <GigCard key={gig._id} gig={gig} />
      ))}
    </motion.div>
  );
}
