const STORAGE_KEY = 'skillswap_user';

export function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('skillswap-auth'));
}

export function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('skillswap-auth'));
}
