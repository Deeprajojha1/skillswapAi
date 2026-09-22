import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <Link to={ROUTES.gigDetails(gig._id)} className="relative block aspect-[16/10] overflow-hidden">
        <Image
          src={gig.image?.url}
          alt={gig.title}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge tone="brand" className="bg-white/95 shadow-sm">
            {gig.category}
          </Badge>
          {isNew ? (
            <Badge tone="info" className="bg-indigo-600 text-white shadow-sm">
              New
            </Badge>
          ) : null}
        </div>
        <div className="absolute right-3 top-3">
          <AvailabilityBadge status={gig.status} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link to={ROUTES.gigDetails(gig._id)}>
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-indigo-700">{gig.title}</h3>
        </Link>

        <Link
          to={ROUTES.creatorProfile(gig.creator?._id || gig.creator?.id)}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-700"
        >
          <Avatar name={gig.creator?.name} size="xs" />
          <span className="truncate">{gig.creator?.name || 'Unknown creator'}</span>
        </Link>

        {gig.reviewCount > 0 ? (
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="font-medium text-slate-700">{gig.rating?.toFixed(1)}</span>
            <span className="text-slate-400">({gig.reviewCount})</span>
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between pt-1">
          <div>
            <p className="text-base font-bold text-slate-900">{formatCurrency(gig.rate)}</p>
            <p className="text-[11px] text-slate-400">{gig.duration}</p>
          </div>
          <Link
            to={ROUTES.gigDetails(gig._id)}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-600"
          >
            View <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
