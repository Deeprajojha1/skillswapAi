import { toast } from 'sonner';

// Centralized toast helpers so no component ever calls `toast.*` directly or
// re-implements its own notification logic (see project rule: no duplicate
// toast implementations).

export function toastSuccess(message, options) {
  return toast.success(message, options);
}

export function toastError(message, options) {
  return toast.error(message || 'Something went wrong. Please try again.', options);
}

export function toastInfo(message, options) {
  return toast(message, options);
}

export function toastWarning(message, options) {
  return toast.warning(message, options);
}

export function toastLoading(message, options) {
  return toast.loading(message, options);
}

export function dismissToast(id) {
  toast.dismiss(id);
}
