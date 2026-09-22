import { X } from 'lucide-react';
import Button from './Button.jsx';

export default function Modal({ title, open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <Button variant="ghost" onClick={onClose} title="Close"><X size={18} /></Button>
        </div>
        {children}
      </section>
    </div>
  );
}
