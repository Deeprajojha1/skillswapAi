/**
 * Formats an amount using the booking/payment currency returned by the backend.
 * Backend default currency is INR (see PAYMENT_CURRENCY env var).
 */
export function formatCurrency(amount, currency = 'INR') {
  const value = Number(amount);
  if (Number.isNaN(value)) return '—';

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString('en-IN')}`;
  }
}
