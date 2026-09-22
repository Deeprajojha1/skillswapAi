import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';
import { ROUTES } from '../../lib/constants.js';
import { truncate } from '../../utils/helpers.js';

export default function CreatorMiniCard({ creator }) {
  if (!creator) return null;
  const creatorId = creator._id || creator.id;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <Avatar name={creator.name} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-900">{creator.name}</h3>
          {creator.bio ? <p className="mt-1 text-xs text-slate-500">{truncate(creator.bio, 140)}</p> : null}
          {creator.skills?.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {creator.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} tone="neutral">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {creatorId ? (
        <Link
          to={ROUTES.creatorProfile(creatorId)}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View profile <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
