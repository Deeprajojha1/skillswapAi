import GigGrid from '../../components/gigs/GigGrid.jsx';
import { GIGS } from '../../utils/constants.js';

export default function MyGigs() {
  return (
    <section className="page-section">
      <p className="eyebrow">Creator</p>
      <h1>My gigs</h1>
      <GigGrid gigs={GIGS.slice(0, 2)} loading={false} />
    </section>
  );
}
