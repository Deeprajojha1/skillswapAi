import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ReduxProvider from './providers/ReduxProvider.jsx';
import QueryProvider from './providers/QueryProvider.jsx';
import AuthProvider from './providers/AuthProvider.jsx';
import SocketProvider from './providers/SocketProvider.jsx';
import ErrorBoundary from '../components/ui/ErrorBoundary.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileNav from '../components/layout/MobileNav.jsx';
import AppRoutes from '../routes/AppRoutes.jsx';
import { selectMobileNavOpen } from './store/slices/uiSlice.js';
import { ROUTES } from '../lib/constants.js';

function AppShell() {
  const mobileNavOpen = useSelector(selectMobileNavOpen);
  const location = useLocation();
  const showFooter = location.pathname === ROUTES.home;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <MobileNav open={mobileNavOpen} />
      <main className="flex flex-1 flex-col">
        <AppRoutes />
      </main>
      {showFooter ? <Footer /> : null}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ReduxProvider>
        <QueryProvider>
          <BrowserRouter>
            <AuthProvider>
              <SocketProvider>
                <AppShell />
              </SocketProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
}
