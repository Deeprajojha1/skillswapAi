import { Link } from 'react-router-dom';
import { Plus, WalletCards } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import BookingCard from '../../components/bookings/BookingCard.jsx';
import { BOOKINGS, GIGS } from '../../utils/constants.js';

export default function CreatorDashboard() {
  const bookings = BOOKINGS.map((booking) => ({ ...booking, gig: GIGS.find((gig) => gig.id === booking.gigId) }));
  return (
    <section className="page-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Creator</p>
          <h1>Dashboard</h1>
        </div>
        <Button as={Link} to="/creator/gigs/new"><Plus size={18} />New gig</Button>
      </div>
      <div className="dashboard-grid">
        <div className="metric"><WalletCards size={24} /><strong>$1,840</strong><span>month earnings</span></div>
        <div className="metric"><strong>12</strong><span>active bookings</span></div>
        <div className="metric"><strong>4.9</strong><span>creator rating</span></div>
      </div>
      <div className="stack">{bookings.map((booking) => <BookingCard booking={booking} creatorView key={booking.id} />)}</div>
    </section>
  );
}
