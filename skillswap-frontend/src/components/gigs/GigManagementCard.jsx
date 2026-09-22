import { Link } from 'react-router-dom';
import { Pencil, Star } from 'lucide-react';
import Image from '../ui/Image.jsx';
import GigStatusBadge from './GigStatusBadge.jsx';
import Badge from '../ui/Badge.jsx';
import { MODERATION_STATUS, MODERATION_STATUS_LABEL, ROUTES } from '../../lib/constants.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const MODERATION_TONES = {
  [MODERATION_STATUS.PENDING]: 'warning',
  [MODERATION_STATUS.APPROVED]: 'success',
  [MODERATION_STATUS.REJECTED]: 'danger',
  [MODERATION_STATUS.FLAGGED]: 'danger',
};

/** Row card for the creator's "My Gigs" list. Edit is the only mutation this
 * card offers — see the "no gig status toggle" note in MyGigs.jsx for why. */
export default function GigManagementCard({ gig }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
      <Link to={ROUTES.gigDetails(gig._id)} className="h-20 w-full shrink-0 overflow-hidden rounded-lg sm:w-32">
        <Image src={gig.image?.url} alt={gig.title} className="h-20 w-full sm:w-32" />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link to={ROUTES.gigDetails(gig._id)} className="truncate text-sm font-semibold text-slate-900 hover:text-indigo-700">
            {gig.title}
          </Link>
          <GigStatusBadge status={gig.status} />
          {gig.moderationStatus ? (
            <Badge tone={MODERATION_TONES[gig.moderationStatus] || 'neutral'}>
              {MODERATION_STATUS_LABEL[gig.moderationStatus] || gig.moderationStatus}
            </Badge>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-slate-500">{gig.category}</p>
        {gig.reviewNote ? <p className="mt-1 text-xs text-amber-700">{gig.reviewNote}</p> : null}
        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
          <span className="font-semibold text-slate-900">{formatCurrency(gig.rate)}</span>
          {gig.reviewCount > 0 ? (
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" /> {gig.rating?.toFixed(1)} ({gig.reviewCount})
            </span>
          ) : null}
        </div>
      </div>

      <Link
        to={ROUTES.creatorEditGig(gig._id)}
        className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:self-center"
      >
        <Pencil className="h-3.5 w-3.5" /> Edit
      </Link>
    </div>
  );
}
