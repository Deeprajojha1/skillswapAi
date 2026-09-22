import Badge from '../ui/Badge.jsx';

const tones = {
  confirmed: 'success',
  'in-progress': 'warning',
  requested: 'neutral',
};

export default function BookingStatus({ status }) {
  return <Badge tone={tones[status] ?? 'neutral'}>{status}</Badge>;
}
