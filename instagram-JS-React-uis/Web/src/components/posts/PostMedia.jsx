import './Posts.css';

function PostMedia({ imageUrl, alt, aspect, className, onClick }) {
  const aspectClass = aspect ? `post-media--${aspect}` : 'post-media--square';
  const wrapperClassName = className
    ? `post-media ${aspectClass} ${className}`
    : `post-media ${aspectClass}`;

  return (
    <div className={wrapperClassName} onClick={onClick}>
      <img className="post-media__image" src={imageUrl} alt={alt || 'Post'} />
    </div>
  );
}

export default PostMedia;
