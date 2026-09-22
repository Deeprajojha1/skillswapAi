import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { isRenderableImageUrl, cn } from '../../utils/helpers.js';

/**
 * Renders a gig/content image with a graceful fallback. The backend can
 * return a `local-upload://<file>` pseudo-URL when Cloudinary isn't
 * configured (not a renderable <img> src), or a broken Cloudinary URL — this
 * component is the single place that handles both cases instead of every
 * gig card re-implementing an onError handler.
 */
export default function Image({ src, alt = '', className, fallbackClassName }) {
  const [failed, setFailed] = useState(false);
  const canRender = isRenderableImageUrl(src) && !failed;

  if (!canRender) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 text-slate-300',
          className,
          fallbackClassName,
        )}
        role="img"
        aria-label={alt || 'No image available'}
      >
        <ImageOff className="h-8 w-8" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  );
}
