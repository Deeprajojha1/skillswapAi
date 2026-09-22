export const CATEGORIES = ['Design', 'Development', 'Writing', 'Marketing', 'Music', 'Tutoring'];

export const GIGS = [
  {
    id: 'brand-kit',
    title: 'Brand kit in a weekend',
    creator: 'Maya Chen',
    category: 'Design',
    price: 180,
    rating: 4.9,
    duration: '2 days',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80',
    description: 'A polished mini identity system with logo cleanup, colors, type, and social templates.',
  },
  {
    id: 'react-landing',
    title: 'React landing page build',
    creator: 'Arjun Rao',
    category: 'Development',
    price: 260,
    rating: 4.8,
    duration: '4 days',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    description: 'Responsive Vite or Next.js landing page implementation with tidy components.',
  },
  {
    id: 'resume-story',
    title: 'Resume and LinkedIn rewrite',
    creator: 'Nora James',
    category: 'Writing',
    price: 95,
    rating: 4.7,
    duration: '1 day',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    description: 'Clear positioning, ATS-friendly resume edits, and a sharper LinkedIn summary.',
  },
  {
    id: 'guitar-basics',
    title: 'Beginner guitar coaching',
    creator: 'Leo Martin',
    category: 'Music',
    price: 45,
    rating: 4.9,
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=80',
    description: 'Friendly one-on-one lessons focused on chords, rhythm, and confident practice.',
  },
];

export const BOOKINGS = [
  { id: 'B-1024', gigId: 'brand-kit', status: 'confirmed', date: '2026-09-25', amount: 180 },
  { id: 'B-1025', gigId: 'react-landing', status: 'in-progress', date: '2026-09-28', amount: 260 },
];
