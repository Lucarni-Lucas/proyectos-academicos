import './Comments.css';

function CommentComposer({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
  loading,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && onSubmit) {
      onSubmit();
    }
  };

  return (
    <form className="comment-composer" onSubmit={handleSubmit}>
      <textarea
        className="comment-composer__input"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder || 'Agregar un comentario…'}
        disabled={disabled || loading}
        rows={3}
      />
      <button
        className="comment-composer__submit"
        type="submit"
        disabled={!value.trim() || disabled || loading}
      >
        {loading ? 'Publicando…' : 'Publicar'}
      </button>
    </form>
  );
}

export default CommentComposer;
