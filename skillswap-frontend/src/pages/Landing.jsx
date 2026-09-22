import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, CalendarDays, Users } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import GigGrid from '../components/gigs/GigGrid.jsx';
import { GIGS } from '../utils/constants.js';

export default function Landing() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Peer services marketplace</p>
          <h1>SkillSwap</h1>
          <p>Find talented people for focused work, lessons, creative help, and practical projects.</p>
          <div className="hero-actions">
            <Button as={Link} to="/marketplace">Browse gigs <ArrowRight size={18} /></Button>
            <Button as={Link} to="/creator" variant="secondary">Start creating</Button>
          </div>
        </div>
      </section>
      <section className="stats">
        <div><Users size={22} /><strong>420+</strong><span>active creators</span></div>
        <div><CalendarDays size={22} /><strong>1.8k</strong><span>bookings completed</span></div>
        <div><BadgeCheck size={22} /><strong>4.8</strong><span>average rating</span></div>
      </section>
      <section className="page-section">
        <div className="section-head">
          <h2>Popular gigs</h2>
          <Link to="/marketplace">View all</Link>
        </div>
        <GigGrid gigs={GIGS.slice(0, 3)} loading={false} />
      </section>
    </>
  );
}
