import { cn } from '../../utils/helpers.js';

/** Consistent max-width + responsive gutter wrapper for every top-level page. */
export default function PageContainer({ children, className, as: Tag = 'div' }) {
  return (
    <Tag className={cn('mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8', className)}>{children}</Tag>
  );
}
