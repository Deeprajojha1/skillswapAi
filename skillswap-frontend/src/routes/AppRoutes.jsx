import { Navigate, Route, Routes } from 'react-router-dom';
import Landing from '../pages/Landing.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Marketplace from '../pages/marketplace/Marketplace.jsx';
import GigDetails from '../pages/marketplace/GigDetails.jsx';
import MyBookings from '../pages/client/MyBookings.jsx';
import BookingDetails from '../pages/client/BookingDetails.jsx';
import SimilarGigs from '../pages/client/SimilarGigs.jsx';
import CreatorDashboard from '../pages/creator/CreatorDashboard.jsx';
import CreateGig from '../pages/creator/CreateGig.jsx';
import MyGigs from '../pages/creator/MyGigs.jsx';
import CreatorBookingDetails from '../pages/creator/CreatorBookingDetails.jsx';
import ProtectedRoute from '../components/layout/ProtectedRoute.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/marketplace/:gigId" element={<GigDetails />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/client/bookings" element={<MyBookings />} />
        <Route path="/client/bookings/:bookingId" element={<BookingDetails />} />
        <Route path="/client/similar/:gigId" element={<SimilarGigs />} />
        <Route path="/creator" element={<CreatorDashboard />} />
        <Route path="/creator/gigs/new" element={<CreateGig />} />
        <Route path="/creator/gigs" element={<MyGigs />} />
        <Route path="/creator/bookings/:bookingId" element={<CreatorBookingDetails />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
