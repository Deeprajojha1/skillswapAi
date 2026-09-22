import { CATEGORIES } from '../../utils/constants.js';

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="segmented" aria-label="Category filter">
      <button className={!value ? 'active' : ''} onClick={() => onChange('')}>All</button>
      {CATEGORIES.map((category) => (
        <button className={value === category ? 'active' : ''} key={category} onClick={() => onChange(category)}>
          {category}
        </button>
      ))}
    </div>
  );
}
