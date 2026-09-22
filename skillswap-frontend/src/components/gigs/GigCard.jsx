import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

export default function GigCard({ gig }) {
  return (
    <article className="gig-card">
      <img src={gig.image} alt="" />
      <div className="gig-body">
        <div className="row between">
          <Badge>{gig.category}</Badge>
          <span className="rating"><Star size={15} fill="currentColor" />{gig.rating}</span>
        </div>
        <h3><Link to={`/marketplace/${gig.id}`}>{gig.title}</Link></h3>
        <p>{gig.description}</p>
        <div className="row between">
          <span className="muted">{gig.creator}</span>
          <strong>${gig.price}</strong>
        </div>
      </div>
    </article>
  );
}
