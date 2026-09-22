import { createSlice } from '@reduxjs/toolkit';

// Global client-only UI state. Never put server data (gigs, bookings, users,
// payments) in here — that belongs to TanStack Query.
const initialState = {
  sidebarOpen: false,
  mobileNavOpen: false,
  activeModal: null, // e.g. "accept-booking" | "decline-booking" | null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    toggleMobileNav(state) {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    setMobileNavOpen(state, action) {
      state.mobileNavOpen = action.payload;
    },
    openModal(state, action) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleMobileNav,
  setMobileNavOpen,
  openModal,
  closeModal,
} = uiSlice.actions;
export default uiSlice.reducer;

export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectMobileNavOpen = (state) => state.ui.mobileNavOpen;
export const selectActiveModal = (state) => state.ui.activeModal;
