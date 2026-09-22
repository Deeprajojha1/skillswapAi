// Gig status uses the exact same visual language in the marketplace and in
// the creator's own gig-management list, so this intentionally re-exports
// the one implementation instead of duplicating badge/status logic.
export { default } from '../marketplace/AvailabilityBadge.jsx';
