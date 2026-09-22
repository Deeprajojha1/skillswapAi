import { AlertCircle, CheckCircle2, Clock, RotateCcw, XCircle } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import { PAYMENT_STATUS } from '../../lib/constants.js';

const CONFIG = {
  [PAYMENT_STATUS.UNPAID]: { label: 'Unpaid', tone: 'neutral', icon: AlertCircle },
  [PAYMENT_STATUS.PENDING]: { label: 'Payment pending', tone: 'warning', icon: Clock },
  [PAYMENT_STATUS.PAID]: { label: 'Payment completed', tone: 'success', icon: CheckCircle2 },
  [PAYMENT_STATUS.FAILED]: { label: 'Payment failed', tone: 'danger', icon: XCircle },
  [PAYMENT_STATUS.REFUNDED]: { label: 'Refunded', tone: 'info', icon: RotateCcw },
};

export default function PaymentStatus({ status }) {
  const config = CONFIG[status] || CONFIG[PAYMENT_STATUS.UNPAID];
  return (
    <Badge tone={config.tone} icon={config.icon}>
      {config.label}
    </Badge>
  );
}
