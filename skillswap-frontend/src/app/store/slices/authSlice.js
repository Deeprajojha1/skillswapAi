import { createSlice } from '@reduxjs/toolkit';

// There's no login any more. This slice mirrors whatever `GET /users/me`
// returns — always a demo user, auto-created server-side per the role sent
// in the `x-skillswap-role` header (see the Client/Creator switch in
// Navbar/MobileNav, driven by hooks/useRoleSwitch.js). It exists purely so
// React components can read "who is the current demo user" synchronously
// without prop-drilling; the backend remains the source of truth for that
// resolution.
const initialState = {
  user: null,
  role: null,
  isAuthenticated: false,
  // true until the initial GET /users/me bootstrap call resolves. Used to
  // avoid rendering role-gated content before we know which demo user we're
  // looking at.
  isInitializing: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.role = action.payload?.role ?? null;
      state.isAuthenticated = Boolean(action.payload);
      state.isInitializing = false;
    },
    clearUser(state) {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
    },
    setInitializing(state, action) {
      state.isInitializing = action.payload;
    },
  },
});

export const { setUser, clearUser, setInitializing } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectRole = (state) => state.auth.role;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsInitializing = (state) => state.auth.isInitializing;
