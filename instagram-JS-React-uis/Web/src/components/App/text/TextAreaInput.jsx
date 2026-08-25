import './Text.css';

function TextAreaInput({
  value,
  onChange,
  placeholder,
  name,
  maxLength,
  error,
  disabled = false,
}) {
  return (
    <div className={`form-field ${error ? 'form-field--error' : ''}`.trim()}>
      <textarea
        className="form-field__textarea"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        name={name}
        maxLength={maxLength}
        disabled={disabled}
      />
      {error && <p className="form-field__error">{error}</p>}
    </div>
  );
}

export default TextAreaInput;
