import apiClient from '../../services/apiClient.js';

// GET /api/users/me. There's no login any more — the backend always
// resolves (and auto-creates on first call) a demo user for whichever role
// is in the `x-skillswap-role` header apiClient attaches to every request.
export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/users/me');
  return data.data;
}

// PATCH /api/users/me. Backend only persists name/bio/skills — anything else
// sent is silently ignored server-side.
export async function updateCurrentUser(payload) {
  const { data } = await apiClient.patch('/users/me', payload);
  return data.data;
}
