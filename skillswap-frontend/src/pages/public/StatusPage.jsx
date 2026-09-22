import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button.jsx';
import { ROUTES } from '../../lib/constants.js';

/** Shared layout for the 404 / 401 / 403 pages — same shape, different copy. */
export default function StatusPage({ icon: Icon, code, title, description }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">{code}</p>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="max-w-sm text-sm text-slate-500">{description}</p>
        <Link to={ROUTES.home}>
          <Button>Back to home</Button>
        </Link>
      </motion.div>
    </div>
  );
}
