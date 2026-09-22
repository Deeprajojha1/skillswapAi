import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

export function useGigs(filters = {}) {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGigs().then((items) => {
      setGigs(items);
      setLoading(false);
    });
  }, []);

  const filteredGigs = useMemo(() => {
    return gigs.filter((gig) => {
      const queryMatch = !filters.query || gig.title.toLowerCase().includes(filters.query.toLowerCase());
      const categoryMatch = !filters.category || gig.category === filters.category;
      return queryMatch && categoryMatch;
    });
  }, [filters.category, filters.query, gigs]);

  return { gigs: filteredGigs, loading };
}
