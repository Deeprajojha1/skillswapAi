/**
 * Safely extracts a user-facing message from any error, including ones that
 * never touched our Axios interceptor (e.g. thrown manually). Always falls
 * back to a generic, safe message instead of leaking `undefined`, raw JSON,
 * or a stack trace to the UI.
 */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;
  if (error.normalized?.message) return error.normalized.message;
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message && !error.message.includes('AxiosError')) {
    return error.message;
  }
  return fallback;
}

export function getFieldErrors(error) {
  return error?.normalized?.fieldErrors || undefined;
}
