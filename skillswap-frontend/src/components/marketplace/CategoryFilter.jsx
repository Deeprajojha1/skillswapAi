import { Code2, Grid3x3, Megaphone, Music, Palette, PenTool, Video, GraduationCap } from 'lucide-react';
import { GIG_CATEGORIES } from '../../lib/constants.js';
import { cn } from '../../utils/helpers.js';

const CATEGORY_ICON = {
  'Graphic Design': Palette,
  'Video Editing': Video,
  'Web Development': Code2,
  Writing: PenTool,
  Marketing: Megaphone,
  Music,
  Tutoring: GraduationCap,
};

const options = [{ value: 'All', label: 'All', icon: Grid3x3 }, ...GIG_CATEGORIES.map((c) => ({ value: c, label: c, icon: CATEGORY_ICON[c] }))];

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1" role="tablist" aria-label="Filter by category">
      {options.map((option) => {
        const isActive = (value || 'All') === option.value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value === 'All' ? '' : option.value)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700',
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
