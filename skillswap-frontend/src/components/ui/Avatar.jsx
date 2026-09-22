import { getAvatarColor, getInitials, cn } from '../../utils/helpers.js';

const SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
};

/**
 * The backend's User model has no avatar/image field at all, so every user
 * avatar in this app is a deterministic initials badge rather than a
 * fabricated placeholder photo.
 */
export default function Avatar({ name = '', size = 'md', className }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold',
        getAvatarColor(name),
        SIZES[size],
        className,
      )}
      aria-hidden="true"
      title={name}
    >
      {getInitials(name)}
    </span>
  );
}
