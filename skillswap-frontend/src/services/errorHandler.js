/**
 * Normalizes any error thrown by Axios (or a plain network failure) into a
 * consistent shape the rest of the app can rely on:
 *
 *   { message, code, status, fieldErrors }
 *
 * - message: a safe, human-readable string. Never a stack trace / raw JSON.
 * - code: a short machine-readable code for programmatic checks.
 * - status: the HTTP status code, or null for network-level failures.
 * - fieldErrors: { [fieldName]: message }, when a field name can actually be
 *   determined (see note below — currently that's never, for this backend).
 *
 * IMPORTANT (verified against the live backend): `validate.middleware.js`
 * builds `details` as `result.error.issues.map((issue) => issue.message)` —
 * a plain array of message STRINGS with the Zod `path` discarded. So a 400
 * response looks like `{ message: "Validation failed", details: ["Title
 * must be at least 3 characters", "Rate must be greater than 0"] }`, not the
 * `[{ path, message }]` shape a Zod-aware frontend might assume. That means
 * true field-level error mapping isn't possible with the current backend —
 * `extractFieldErrors` below stays in place defensively (and would activate
 * automatically if the backend ever starts including `path`), but the real
 * fix is folding those detail strings into `message` so they aren't
 * silently dropped behind the generic "Validation failed" text.
 */

const STATUS_FALLBACK_MESSAGE = {
  400: 'That request could not be processed. Please check the details and try again.',
  401: 'Could not identify your account for this request. Please try again.',
  403: "You don't have permission to perform this action.",
  404: 'The requested resource could not be found.',
  409: 'This action conflicts with the current state. Please refresh and try again.',
  422: 'Some fields need your attention.',
  429: 'Too many requests. Please try again shortly.',
  500: 'Something went wrong on the server. Please try again.',
  502: 'Something went wrong on the server. Please try again.',
  503: 'The service is temporarily unavailable. Please try again shortly.',
};

function extractFieldErrors(details) {
  if (!details) return undefined;

  // Zod's flatten()/issues style: [{ path: ['email'], message: '...' }, ...]
  if (Array.isArray(details)) {
    const fieldErrors = {};
    for (const issue of details) {
      const key = Array.isArray(issue.path) ? issue.path.join('.') : issue.path;
      if (key) fieldErrors[key] = issue.message;
    }
    return Object.keys(fieldErrors).length ? fieldErrors : undefined;
  }

  // Zod flatten() style: { fieldErrors: { email: ['...'] } }
  if (details.fieldErrors && typeof details.fieldErrors === 'object') {
    const fieldErrors = {};
    for (const [key, messages] of Object.entries(details.fieldErrors)) {
      if (Array.isArray(messages) && messages.length) fieldErrors[key] = messages[0];
    }
    return Object.keys(fieldErrors).length ? fieldErrors : undefined;
  }

  return undefined;
}

/** The current backend's actual shape: an array of plain message strings,
 * with no field name attached (see the note above `extractFieldErrors`). */
function extractValidationText(details) {
  if (Array.isArray(details) && details.length && details.every((item) => typeof item === 'string')) {
    return details.join(' ');
  }
  return null;
}

export function normalizeError(error) {
  // Network error / no response reached the server at all.
  if (!error?.response) {
    if (error?.code === 'ECONNABORTED') {
      return {
        message: 'The request timed out. Please try again.',
        code: 'TIMEOUT',
        status: null,
        fieldErrors: undefined,
      };
    }
    return {
      message: 'Unable to connect to the server. Please check your connection.',
      code: 'NETWORK_ERROR',
      status: null,
      fieldErrors: undefined,
    };
  }

  const { status, data } = error.response;
  const backendMessage = typeof data?.message === 'string' ? data.message : null;
  const fieldErrors = extractFieldErrors(data?.details);
  const validationText = fieldErrors ? null : extractValidationText(data?.details);

  const message =
    validationText ||
    backendMessage ||
    STATUS_FALLBACK_MESSAGE[status] ||
    'Something went wrong. Please try again.';

  return {
    message,
    code: data?.code || `HTTP_${status}`,
    status,
    fieldErrors,
  };
}
