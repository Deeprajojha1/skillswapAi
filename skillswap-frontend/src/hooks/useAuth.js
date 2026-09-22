import { useEffect, useState } from 'react';
import { clearStoredUser, getStoredUser, setStoredUser } from '../store/authStore.js';

export function useAuth() {
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    window.addEventListener('skillswap-auth', sync);
    return () => window.removeEventListener('skillswap-auth', sync);
  }, []);

  const login = (email, role = 'client') => {
    const nextUser = { name: email.split('@')[0], email, role };
    setStoredUser(nextUser);
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    clearStoredUser();
    setUser(null);
  };

  return { user, login, logout, isAuthenticated: Boolean(user) };
}
