import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock3, Star } from 'lucide-react';
import Image from '../ui/Image.jsx';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';
import AvailabilityBadge from './AvailabilityBadge.jsx';
import { ROUTES } from '../../lib/constants.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function GigCard({ gig }) {
  const isNew = gig.createdAt && Date.now() - new Date(gig.createdAt).getTime() < SEVEN_DAYS_MS;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all hover:border-indigo-200 hover:shadow-[0_16px_34px_rgba(79,70,229,0.14)]"
    >
      <Link to={ROUTES.gigDetails(gig._id)} className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={gig.image?.url}
          alt={gig.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/10" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <Badge tone="brand" className="bg-white/95 font-semibold shadow-sm">
            {gig.category}
          </Badge>
          <AvailabilityBadge status={gig.status} />
        </div>
        {isNew ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 shadow-sm">
            Just added
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3.5 p-4.5">
        <Link to={ROUTES.gigDetails(gig._id)}>
          <h3 className="line-clamp-2 min-h-11 text-[15px] font-bold leading-6 text-slate-900 transition-colors group-hover:text-indigo-700">
            {gig.title}
          </h3>
        </Link>

        <p className="line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">
          {gig.description || 'A professional service tailored to your project.'}
        </p>

        <Link
          to={ROUTES.creatorProfile(gig.creator?._id || gig.creator?.id)}
          className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 hover:text-indigo-700"
        >
          <Avatar name={gig.creator?.name} size="xs" />
          <span className="truncate">By {gig.creator?.name || 'Unknown creator'}</span>
        </Link>

        {gig.reviewCount > 0 ? (
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="font-medium text-slate-700">{gig.rating?.toFixed(1)}</span>
            <span className="text-slate-400">({gig.reviewCount})</span>
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Starting at</p>
            <p className="mt-0.5 text-lg font-extrabold text-slate-950">{formatCurrency(gig.rate)}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
              <Clock3 className="h-3 w-3" /> {gig.duration || 'Flexible delivery'}
            </p>
          </div>
          <Link
            to={ROUTES.gigDetails(gig._id)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            View details <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
