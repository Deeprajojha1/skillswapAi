import { Link, NavLink } from 'react-router-dom';
import { LogOut, ShoppingBag, Sparkles, UserRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../ui/Button.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <img src="/logo.svg" alt="" />
        <span>SkillSwap</span>
      </Link>
      <nav>
        <NavLink to="/marketplace">Marketplace</NavLink>
        <NavLink to="/client/bookings">Bookings</NavLink>
        <NavLink to="/creator">Creator</NavLink>
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="user-chip"><UserRound size={16} />{user.name}</span>
            <Button variant="ghost" onClick={logout} title="Log out"><LogOut size={18} /></Button>
          </>
        ) : (
          <>
            <Button as={Link} to="/login" variant="ghost"><ShoppingBag size={18} />Login</Button>
            <Button as={Link} to="/register"><Sparkles size={18} />Join</Button>
          </>
        )}
      </div>
    </header>
  );
}
