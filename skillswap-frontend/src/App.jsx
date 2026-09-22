import AppRoutes from './routes/AppRoutes.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Toast from './components/ui/Toast.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
      <Toast />
    </div>
  );
}
