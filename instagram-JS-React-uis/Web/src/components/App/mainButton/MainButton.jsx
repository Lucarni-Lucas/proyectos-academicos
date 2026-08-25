import './MainButton.css';

function MainButton({
  label,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  variant = 'primary',
}) {
  const computedDisabled = disabled || loading;

  return (
    <button
      className={`main-button ${variant === 'secondary' ? 'main-button-variant' : ''} ${fullWidth ? 'main-button--full' : ''}`}
      type={type}
      onClick={onClick}
      disabled={computedDisabled}
    >
      {loading ? 'Cargando...' : label}
    </button>
  );
}

export default MainButton;
