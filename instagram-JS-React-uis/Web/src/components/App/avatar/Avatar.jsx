import './Avatar.css';

function Avatar({ src, alt, size, onClick }) {
  const computedSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <img
      className="avatar"
      src={src}
      alt={alt}
      style={{ width: computedSize, height: computedSize }}
      onClick={onClick}
    />
  );
}

export default Avatar;
