import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import { FullScreenLoader } from '../components/ui/Spinner.jsx';
import { ROUTES } from '../lib/constants.js';

// Every route is code-split so the initial bundle only pays for the shell +
// whichever page the visitor actually lands on (section 37: lazy-loaded
// routes).
const Landing = lazy(() => import('../pages/public/Landing.jsx'));
const NotFound = lazy(() => import('../pages/public/NotFound.jsx'));
const Unauthorized = lazy(() => import('../pages/public/Unauthorized.jsx'));

const Marketplace = lazy(() => import('../pages/marketplace/Marketplace.jsx'));
const GigDetails = lazy(() => import('../pages/marketplace/GigDetails.jsx'));
const CreatorProfile = lazy(() => import('../pages/marketplace/CreatorProfile.jsx'));

const MyBookings = lazy(() => import('../pages/client/MyBookings.jsx'));
const PaymentPage = lazy(() => import('../pages/client/PaymentPage.jsx'));

const CreatorDashboard = lazy(() => import('../pages/creator/CreatorDashboard.jsx'));
const MyGigs = lazy(() => import('../pages/creator/MyGigs.jsx'));
const CreateGig = lazy(() => import('../pages/creator/CreateGig.jsx'));
const EditGig = lazy(() => import('../pages/creator/EditGig.jsx'));
const IncomingBookings = lazy(() => import('../pages/creator/IncomingBookings.jsx'));

const BookingDetails = lazy(() => import('../pages/shared/BookingDetails.jsx'));
const Notifications = lazy(() => import('../pages/shared/Notifications.jsx'));

const Profile = lazy(() => import('../pages/profile/Profile.jsx'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<FullScreenLoader label="Loading page..." />}>
      <Routes>
        {/* Public — no login exists any more; there's just a demo user per
            role, resolved server-side from the `x-skillswap-role` header. */}
        <Route path={ROUTES.home} element={<Landing />} />
        {/* Old bookmarks/links to the removed login/register pages land on the marketplace instead of 404ing. */}
        <Route path={ROUTES.login} element={<Navigate to={ROUTES.marketplace} replace />} />
        <Route path={ROUTES.register} element={<Navigate to={ROUTES.marketplace} replace />} />
        <Route path={ROUTES.marketplace} element={<Marketplace />} />
        <Route path={ROUTES.gigDetails()} element={<GigDetails />} />
        <Route path={ROUTES.creatorProfile()} element={<CreatorProfile />} />

        {/* Every page below is reachable regardless of the current Client/
            Creator tab — there's no permission wall between them any more.
            ProtectedRoute only waits for the initial "resolve the demo
            user" bootstrap to finish, so a page never renders with a null
            user for a frame. */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.profile} element={<Profile />} />
          <Route path={ROUTES.notifications} element={<Notifications />} />

          <Route path={ROUTES.clientBookings} element={<MyBookings />} />
          <Route path={ROUTES.clientBookingDetails()} element={<BookingDetails />} />
          <Route path={ROUTES.clientPay()} element={<PaymentPage />} />
          <Route path={ROUTES.clientNotifications} element={<Notifications />} />

          <Route path={ROUTES.creatorDashboard} element={<CreatorDashboard />} />
          <Route path={ROUTES.creatorGigs} element={<MyGigs />} />
          <Route path={ROUTES.creatorNewGig} element={<CreateGig />} />
          <Route path={ROUTES.creatorEditGig()} element={<EditGig />} />
          <Route path={ROUTES.creatorBookings} element={<IncomingBookings />} />
          <Route path={ROUTES.creatorBookingDetails()} element={<BookingDetails />} />
          <Route path={ROUTES.creatorNotifications} element={<Notifications />} />
        </Route>

        {/* Errors */}
        <Route path={ROUTES.unauthorized} element={<Unauthorized />} />
        <Route path={ROUTES.notFound} element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
