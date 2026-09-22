import { Link } from 'react-router-dom';
import { Handshake } from 'lucide-react';
import { ROUTES, USER_ROLES } from '../../lib/constants.js';
import { useRoleSwitch } from '../../hooks/useRoleSwitch.js';

export default function Footer() {
  const switchRole = useRoleSwitch();

  return (
    <footer className="border-t border-slate-200 bg-white pb-20 lg:pb-0">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
            <Handshake className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">SkillSwap</p>
            <p className="text-xs text-slate-500">A Creator Gig Marketplace</p>
          </div>
        </div>
        <nav className="flex items-center gap-5 text-sm text-slate-500">
          <Link to={ROUTES.marketplace} className="hover:text-slate-900">
            Marketplace
          </Link>
          <button
            type="button"
            onClick={() => switchRole(USER_ROLES.CREATOR)}
            className="hover:text-slate-900"
          >
            Become a creator
          </button>
        </nav>
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
      </div>
    </footer>
  );
}
