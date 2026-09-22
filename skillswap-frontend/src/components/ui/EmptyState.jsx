import { SearchX } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', message = 'Try another search or filter.' }) {
  return (
    <div className="empty-state">
      <SearchX size={34} />
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}
