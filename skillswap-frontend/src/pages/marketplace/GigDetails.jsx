import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, DollarSign, Star } from 'lucide-react';
import BookingForm from '../../components/bookings/BookingForm.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { GIGS } from '../../utils/constants.js';

export default function GigDetails() {
  const { gigId } = useParams();
  const [booked, setBooked] = useState(null);
  const gig = useMemo(() => GIGS.find((item) => item.id === gigId), [gigId]);

  if (!gig) return <section className="page-section"><h1>Gig not found</h1></section>;

  return (
    <section className="detail-layout">
      <div>
        <Button as={Link} to="/marketplace" variant="ghost"><ArrowLeft size={18} />Back</Button>
        <img className="detail-image" src={gig.image} alt="" />
        <h1>{gig.title}</h1>
        <p className="lead">{gig.description}</p>
        <div className="meta-row">
          <Badge>{gig.category}</Badge>
          <span><Star size={17} fill="currentColor" />{gig.rating}</span>
          <span><Clock size={17} />{gig.duration}</span>
          <span><DollarSign size={17} />{gig.price}</span>
        </div>
      </div>
      <aside>
        <h2>Book {gig.creator}</h2>
        <BookingForm gig={gig} onBooked={setBooked} />
      </aside>
      <Modal title="Booking requested" open={Boolean(booked)} onClose={() => setBooked(null)}>
        <p>Your request was created for {gig.title}. The creator can confirm next steps from their dashboard.</p>
      </Modal>
    </section>
  );
}
