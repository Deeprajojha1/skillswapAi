import { useEffect, useState } from 'react';

/**
 * Creates a `URL.createObjectURL` preview for a File and revokes it
 * automatically when the file changes or the component unmounts. Used by
 * both `GigImageUploader` and `GigPreview` so a blob URL is never created on
 * every render (which would leak memory) or duplicated between the two.
 */
export function useObjectUrl(file) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return undefined;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}
