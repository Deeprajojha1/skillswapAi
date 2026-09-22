import { useSelector } from 'react-redux';
import { Eye } from 'lucide-react';
import { selectCurrentUser } from '../../app/store/slices/authSlice.js';
import Image from '../ui/Image.jsx';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useObjectUrl } from '../../hooks/useObjectUrl.js';

/**
 * Read-only live preview of how a gig will look on the marketplace, fed by
 * `GigForm`'s `onValuesChange` callback. Purely presentational — it never
 * calls the API itself.
 */
export default function GigPreview({ values, existingImageUrl }) {
  const user = useSelector(selectCurrentUser);
  const objectUrl = useObjectUrl(values?.imageFile);
  const previewUrl = objectUrl || existingImageUrl;

  return (
    <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-4">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        <Eye className="h-3.5 w-3.5" /> Live preview
      </p>
      <div className="overflow-hidden rounded-xl border border-slate-100">
        <Image src={previewUrl} alt="" className="aspect-[16/10] w-full" />
        <div className="space-y-2 p-3.5">
          {values?.category ? <Badge tone="brand">{values.category}</Badge> : null}
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
            {values?.title || 'Your gig title will appear here'}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Avatar name={user?.name} size="xs" />
            <span>{user?.name || 'You'}</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <p className="text-base font-bold text-slate-900">
              {values?.rate ? formatCurrency(values.rate) : '₹—'}
            </p>
            <p className="text-[11px] text-slate-400">{values?.duration || ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
