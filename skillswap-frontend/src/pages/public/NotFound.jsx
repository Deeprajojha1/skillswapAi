import { SearchX } from 'lucide-react';
import StatusPage from './StatusPage.jsx';

export default function NotFound() {
  return (
    <StatusPage
      icon={SearchX}
      code="404"
      title="Page not found"
      description="The page you're looking for doesn't exist or may have been moved."
    />
  );
}
