import { createSlice } from '@reduxjs/toolkit';

// UI-only notification state. The actual notification list and unread count
// are server state and live in TanStack Query (see
// features/notifications/notificationHooks.js). This slice only tracks
// ephemeral UI concerns: whether the bell dropdown is open, and a short-lived
// "pulse" flag toggled by the socket provider so the bell can animate when a
// realtime notification arrives.
const initialState = {
  isDropdownOpen: false,
  hasNewPulse: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setDropdownOpen(state, action) {
      state.isDropdownOpen = action.payload;
    },
    triggerPulse(state) {
      state.hasNewPulse = true;
    },
    clearPulse(state) {
      state.hasNewPulse = false;
    },
  },
});

export const { setDropdownOpen, triggerPulse, clearPulse } = notificationSlice.actions;
export default notificationSlice.reducer;

export const selectNotificationDropdownOpen = (state) => state.notification.isDropdownOpen;
export const selectHasNewPulse = (state) => state.notification.hasNewPulse;
