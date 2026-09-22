import { useState } from 'react';
import GigFilters from '../../components/gigs/GigFilters.jsx';
import GigGrid from '../../components/gigs/GigGrid.jsx';
import { useGigs } from '../../hooks/useGigs.js';

export default function Marketplace() {
  const [filters, setFilters] = useState({ query: '', category: '' });
  const { gigs, loading } = useGigs(filters);

  return (
    <section className="page-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Marketplace</p>
          <h1>Book a skill</h1>
        </div>
      </div>
      <GigFilters filters={filters} setFilters={setFilters} />
      <GigGrid gigs={gigs} loading={loading} />
    </section>
  );
}
