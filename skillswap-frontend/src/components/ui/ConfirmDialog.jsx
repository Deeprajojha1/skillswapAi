import Dialog from './Dialog.jsx';
import Button from './Button.jsx';

/**
 * Yes/no confirmation built on top of `Dialog`. Used for accept / decline /
 * cancel / complete booking confirmations so every one of those flows shares
 * one implementation of "are you sure" UX (open state, busy state, danger
 * styling).
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  confirmingLabel = 'Working…',
  cancelLabel = 'Cancel',
  isConfirming = false,
  variant = 'primary',
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isConfirming}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} isLoading={isConfirming} loadingText={confirmingLabel}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Dialog>
  );
}
