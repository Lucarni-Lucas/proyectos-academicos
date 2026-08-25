import MainButton from '../mainButton/MainButton';
import './Modal.css';

function Modal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isDanger = false,
  loading = false,
  loadingLabel = 'Cargando...',
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal__title">{title}</h3>
        <p className="modal__message">{message}</p>
        <div className="modal__actions">
          <MainButton
            className="modal__cancel-button"
            label={cancelLabel}
            onClick={onCancel}
            variant="secondary"
            disabled={loading}
          />
          <MainButton
            label={loading ? loadingLabel : confirmLabel}
            onClick={onConfirm}
            variant={isDanger ? 'danger' : 'primary'}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default Modal;
