import EmptyState from '../ui/EmptyState.jsx';
import Skeleton from '../ui/Skeleton.jsx';
import GigCard from './GigCard.jsx';

export default function GigGrid({ gigs, loading }) {
  if (loading) return <Skeleton rows={4} />;
  if (!gigs.length) return <EmptyState title="No gigs found" />;
  return <div className="gig-grid">{gigs.map((gig) => <GigCard gig={gig} key={gig.id} />)}</div>;
}
