import { useCallback, useId, useRef, useState } from 'react';
import { ImagePlus, UploadCloud, X } from 'lucide-react';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from '../../features/gigs/gigSchemas.js';
import Image from '../ui/Image.jsx';
import { Spinner } from '../ui/Spinner.jsx';
import { cn } from '../../utils/helpers.js';
import { useObjectUrl } from '../../hooks/useObjectUrl.js';

function validateFile(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Please upload a valid image.';
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'Image must be smaller than 5MB.';
  }
  return null;
}

/**
 * Drag/drop + click-to-upload gig image control. Only used on gig creation —
 * the backend's PATCH /gigs/:id route has no file-upload middleware, so
 * editing a gig cannot change its image (see EditGig page for the read-only
 * treatment there).
 */
export default function GigImageUploader({ file, onChange, error, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState('');
  const inputRef = useRef(null);
  const inputId = useId();

  const previewUrl = useObjectUrl(file);

  const handleFiles = useCallback(
    (fileList) => {
      if (disabled) return;
      const selected = fileList?.[0];
      if (!selected) return;
      const validationError = validateFile(selected);
      if (validationError) {
        setLocalError(validationError);
        return;
      }
      setLocalError('');
      onChange(selected);
    },
    [onChange, disabled],
  );

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
        Gig image
      </label>

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-slate-200">
          <Image src={previewUrl} alt="Gig preview" className="aspect-[16/9] w-full" />
          {disabled ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40">
              <Spinner size={28} className="text-white" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Remove image"
              className="absolute right-2 top-2 rounded-full bg-slate-900/70 p-1.5 text-white hover:bg-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            if (disabled) return;
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onKeyDown={(event) => {
            if (!disabled && (event.key === 'Enter' || event.key === ' ')) inputRef.current?.click();
          }}
          className={cn(
            'flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition-colors',
            disabled
              ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
              : cn(
                  'cursor-pointer',
                  isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:border-indigo-300',
                ),
          )}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-500 shadow-sm">
            {isDragging ? <UploadCloud className="h-5 w-5" /> : <ImagePlus className="h-5 w-5" />}
          </span>
          <p className="text-sm font-medium text-slate-600">Drag & drop or click to upload</p>
          <p className="text-xs text-slate-400">JPG, PNG or WEBP — up to 5MB (optional)</p>
        </div>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => handleFiles(event.target.files)}
      />

      {(error || localError) ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600">{error || localError}</p>
      ) : null}
    </div>
  );
}
