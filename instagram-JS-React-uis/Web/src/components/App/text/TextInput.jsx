import './Text.css';

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  name,
  error = '',
  disabled = false,
}) {
  return (
    <div className={`form-field ${error ? 'form-field--error' : ''}`.trim()}>
      <input
        className="form-field__input"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        type={type}
        name={name}
        disabled={disabled}
      />
      {error && <p className="form-field__error">{error}</p>}
    </div>
  );
}

export default TextInput;
