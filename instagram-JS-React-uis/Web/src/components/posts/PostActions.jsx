import './Posts.css';

function PostActions({
  likesCount,
  commentsCount,
  isLiked,
  onToggleLike,
  onOpenComments,
}) {
  const likeIcon = isLiked ? '/like-filled.svg' : '/like.svg';
  const safeLikes = likesCount ?? 0;
  const safeComments = commentsCount ?? 0;

  return (
    <div className="post-actions">
      <button
        className={`post-actions__btn ${isLiked ? 'post-actions__btn--liked' : ''}`}
        onClick={onToggleLike}
        type="button"
      >
        <img className="post-actions__icon" src={likeIcon} alt="Me gusta" />
        <span className="post-actions__text">{safeLikes} Me gusta</span>
      </button>
      <button
        className="post-actions__btn"
        onClick={onOpenComments}
        type="button"
      >
        <img
          className="post-actions__icon"
          src="/comment.svg"
          alt="Comentarios"
        />
        <span className="post-actions__text">{safeComments} Comentarios</span>
      </button>
    </div>
  );
}

export default PostActions;
