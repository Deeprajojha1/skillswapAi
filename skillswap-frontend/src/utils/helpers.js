/** Merges class names, skipping falsy values. Lightweight stand-in for `clsx`. */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/** "Deepraj Ojha" -> "DO". Used by the Avatar component (users have no avatar image field). */
export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const AVATAR_PALETTE = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-teal-100 text-teal-700',
];

/** Deterministic color per user id/name, so the same person always gets the same avatar color. */
export function getAvatarColor(seed = '') {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

/**
 * The backend falls back to a `local-upload://<filename>` pseudo-URL when
 * Cloudinary isn't configured. That string is not renderable by <img>, so we
 * detect it (and any other non-http(s) value) and show a placeholder instead.
 *
 * `blob:` and `data:` URLs ARE renderable and must be allowed through — the
 * gig image uploader's live preview (see hooks/useObjectUrl.js) renders a
 * freshly-selected file via `URL.createObjectURL`, which produces a
 * `blob:http://localhost:...` URL, not an http(s) one.
 */
export function isRenderableImageUrl(url) {
  return typeof url === 'string' && /^(https?|blob|data):/i.test(url);
}

export function truncate(text = '', max = 120) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

/** Builds a clean query string, dropping empty/undefined/"All" values. */
export function buildQueryString(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === 'All') return;
    search.set(key, value);
  });
  const str = search.toString();
  return str ? `?${str}` : '';
}
