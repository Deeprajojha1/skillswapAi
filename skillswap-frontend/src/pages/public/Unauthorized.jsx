import { LogIn } from 'lucide-react';
import StatusPage from './StatusPage.jsx';

export default function Unauthorized() {
  return (
    <StatusPage
      icon={LogIn}
      code="401"
      title="Please log in"
      description="You need to be logged in to view this page."
    />
  );
}
