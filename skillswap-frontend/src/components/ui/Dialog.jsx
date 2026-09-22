import Modal from './Modal.jsx';

/**
 * Content-layout wrapper around `Modal` for dialogs that need a header,
 * body, and a footer of actions (as opposed to `ConfirmDialog`, which is a
 * yes/no-shaped specialization of this same layout).
 */
export default function Dialog({ isOpen, onClose, title, description, footer, children, size = 'md' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      {description ? <p className="mb-4 text-sm text-slate-500">{description}</p> : null}
      <div>{children}</div>
      {footer ? <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div> : null}
    </Modal>
  );
}
