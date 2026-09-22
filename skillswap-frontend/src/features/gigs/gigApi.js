import apiClient from '../../services/apiClient.js';
import { buildQueryString } from '../../utils/helpers.js';

// GET /api/gigs?search=&category=  (server-side filtered; backend has no
// sort/pagination params, so sorting is applied client-side in gigHooks.js)
export async function fetchGigs(filters = {}) {
  const { data } = await apiClient.get(`/gigs${buildQueryString(filters)}`);
  return data.data;
}

// GET /api/gigs/:id
export async function fetchGig(gigId) {
  const { data } = await apiClient.get(`/gigs/${gigId}`);
  return data.data;
}

// GET /api/gigs/:id/similar
export async function fetchSimilarGigs(gigId) {
  const { data } = await apiClient.get(`/gigs/${gigId}/similar`);
  return data.data;
}

// GET /api/gigs/mine - creator/admin private list, including pending review,
// flagged, rejected, paused, booked, and inactive gigs.
export async function fetchMyGigs() {
  const { data } = await apiClient.get('/gigs/mine');
  return data.data;
}

// POST /api/gigs (multipart/form-data — creator + admin only).
// `imageFile` is optional; the backend accepts a gig with no image.
export async function createGig({ imageFile, ...fields }) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
  if (imageFile) formData.append('image', imageFile);

  const { data } = await apiClient.post('/gigs', formData);
  return data.data;
}

// PATCH /api/gigs/:id (JSON only — the backend does not accept a new image
// file on update, see route definition in gig.routes.js).
export async function updateGig(gigId, payload) {
  const { data } = await apiClient.patch(`/gigs/${gigId}`, payload);
  return data.data;
}
