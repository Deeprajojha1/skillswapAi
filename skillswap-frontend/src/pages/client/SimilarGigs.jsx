import { useParams } from 'react-router-dom';
import GigGrid from '../../components/gigs/GigGrid.jsx';
import { GIGS } from '../../utils/constants.js';

export default function SimilarGigs() {
  const { gigId } = useParams();
  const current = GIGS.find((gig) => gig.id === gigId);
  const gigs = GIGS.filter((gig) => gig.id !== gigId && (!current || gig.category === current.category));
  return (
    <section className="page-section">
      <h1>Similar gigs</h1>
      <GigGrid gigs={gigs} loading={false} />
    </section>
  );
}
